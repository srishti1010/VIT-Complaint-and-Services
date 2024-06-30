const express = require('express');
const router = express.Router();
const adminSchema = require('./users');
const studentSchema = require("./student");
const complaintSchema = require("./complaint");
const serviceschema=require("./service");
const meetingschema = require("./meetings");
const bcrypt = require('bcrypt');
const localStrategy = require("passport-local");
const passport = require("passport");
let check ;
passport.use(studentSchema.createStrategy());
// Define isloggedin function before its usage
function isloggedin(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login/student");
}

// Profile page student
router.get("/studentprofile", async (req, res) => {
  // Retrieve data from session
  res.render('studentprofile', { check });
});


// Profile page student
router.get("/adminprofile", async (req, res) => {
  // Retrieve data from session
  res.render('adminprofile', { check1 });
});



// get admin all complaints
router.get("/adminallcomplaint", async (req, res) => {
  let complaints = await complaintSchema.find();
  res.render('adminallcomplaint', {complaints});
});

// post admin get complaint
router.post("/filter",async(req,res)=>{
  let typeofcomplaint = req.body.type;

  if(typeofcomplaint == "")
  {
    let complaints = await complaintSchema.find();
    res.render('adminallcomplaint', {complaints});
  }
  else
  {
  let complaints = await complaintSchema.find({type:typeofcomplaint});
  res.render("adminallcomplaint",{complaints});
}
})

// admin hostel complaints
router.get("/adminhostelcomplaint", async (req, res) => {
  let hostelcomplaints = await complaintSchema.find({type:"hostel"});
  res.render('adminhostelcomplaint', {hostelcomplaints});
});


// admin mess complaints
router.get("/adminmesscomplaint", async (req, res) => {
  let messcomplaints = await complaintSchema.find({type:"mess"});
  res.render('adminmesscomplaint', {messcomplaints});
});


router.post("/markcompleted/:complaintId", async (req, res) => {
  const complaintId = req.params.complaintId;
   let det = await complaintSchema.findOne({_id:complaintId});
   det.status = "completed";
   await det.save();
   let pendingcomplaints = await complaintSchema.find({status:"pending"});
  res.render('adminpendingcomplaint', {pendingcomplaints});
});



router.post("/inprogress/:complaintId", async (req, res) => {
  const complaintId = req.params.complaintId;
   let det = await complaintSchema.findOne({_id:complaintId});
   det.status = "inprogress";
   await det.save();
   let pendingcomplaints = await complaintSchema.find({ status: { $in: ["pending", "inprogress"] } });

  res.render('adminpendingcomplaint', {pendingcomplaints});
});







router.get("/admincompletedcomplaint", async (req, res) => {
  let completedcomplaints = await complaintSchema.find({status:"completed"});
  res.render('admincompletedcomplaint', {completedcomplaints});
});



// admin pending complaints
router.get("/adminpendingcomplaint", async (req, res) => {
  let pendingcomplaints = await complaintSchema.find({ status: { $in: ["pending", "inprogress"] } });
  res.render('adminpendingcomplaint', {pendingcomplaints});
});



// admin ragging complaints
router.get("/adminraggingcomplaint", async (req, res) => {
  let raggingcomplaints = await complaintSchema.find({type:"ragging"});
  res.render('adminraggingcomplaint', {raggingcomplaints});
});


//admin student search route
router.post("/searchstudent",async (req,res)=>{

     let searched = await studentSchema.findOne({registrationNumber:req.body.registrationNumber});
     await console.log(searched);
    if(searched)
    {
      res.render("adminstudent",{searched})
    }
    else{
      res.render("adminstudent",{searched,message:"not found"});
    }
    

})


router.get("/adminstudent",async (req,res)=>{
res.render("adminstudent",{searched:"",message:""})

})


// Student login page
router.get('/login/student', (req, res) => {
  res.render('studentlogin');
});


// admin login page
router.get('/login/admin', (req, res) => {
  res.render('adminlogin');
});


// post route for admin

router.post('/adminlogin', async (req, res) => {
  try {
     check1 = await adminSchema.findOne({ username: req.body.username });
    if (!check1) {
      res.render('adminlogin', { message: "User not found" });
    }

    const ispasswordmatch = await bcrypt.compare(req.body.password, check1.password);

    if (ispasswordmatch) {
      // Store data in session
      let fetchedmessages = await meetingschema.find();
      
      res.render('adminhome',{check1,fetchedmessages});
    } else {
      res.render('adminlogin',{ message: "Incorrect Password"})
    }
  } catch {
    res.render('adminlogin', { message: "Incorrect Password" });
  }
});






//post route for service
router.post("/submitservice",async(req,res)=>{

  let servicedata=await new serviceschema({
    roomnumber:req.body.roomnumber,
    name:req.body.name,
    registrationnumber:req.body.registrationnumber,
    mobilenumber:req.body.mobilenumber,
    type:req.body.type,
    availability:req.body.availability
  });
  await servicedata.save();
  res.render('studentservice',{check,succ : "submitted"});
})




// Post router for student login
router.post('/studentlogin', async (req, res) => {
  try {
   
     check = await studentSchema.findOne({ username: req.body.email });
    if (!check) {
      res.render('studentlogin', { message: "User not found " });
    }

    const ispasswordmatch = await bcrypt.compare(req.body.password, check.password);

    if (ispasswordmatch) {
      // Store data in session
     req.session.studentData = { check };
     let fetchedservices = await serviceschema.find({registrationnumber:check.registrationNumber});
    
      res.render('studenthome',{check,fetchedservices});
    } else {
      res.render('studentlogin', { message: "Incorrect Password" });
    }
  } catch {
    res.render('studentlogin', { message: "Incorrect Password" });
  }
});


// post route for complaint submit
router.post("/complaintsubmit",async(req,res)=>{
  let details = await new complaintSchema({
    name :req.body.name,
    address:req.body.address,
    registrationnumber:req.body.registrationnumber,
    type:req.body.type,
    mobilenumber:req.body.mobilenumber,
    description:req.body.description

  });
  let fetched = await studentSchema.findOne({registrationNumber :req.body.registrationnumber });
  fetched.complaint.push(details._id);
  await details.save(); 
  await fetched.save();
  
 res.render("studentcomplaint",{check,succ : "successfully registered"});
})


/* GET student home page. */
router.get('/studenthome',async function (req, res) {
  // Retrieve data from session
  let fetchedservices = await serviceschema.find({registrationnumber:check.registrationNumber});
  res.render('studenthome',{check,fetchedservices});
});



/* GET student complaint page. */
router.get('/studentcomplaint', function (req, res) {
  // Retrieve data from session
  res.render('studentcomplaint',{check,succ:""});
});



/* GET student service. */
router.get('/studentservice', function (req, res) {
  // Retrieve data from session
  res.render('studentservice',{check,succ : ""});
});



/* GET admin home page. */
router.get('/adminhome',async function (req, res) {
  let fetchedmessages = await meetingschema.find();
  res.render('adminhome',{check1,fetchedmessages});

});



/* GET admin worker details page. */
router.get('/adminworkerdetails', function (req, res) {
  res.render('adminworkerdetails');
});


/* GET admin warden details page. */
router.get('/adminwardendetails', function (req, res) {
  res.render('adminwardendetails');
});


/* GET admin  message page. */
router.get('/adminmessage',async function (req, res) {
  let meetings = await meetingschema.find();
  res.render('adminmessage',{meetings});
});

// post route for deleting a meeting
router.post('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    // Find the meeting by its id and delete it
    await meetingschema.findOneAndDelete({ id: id });
    res.redirect('adminmessage'); // Redirect back to the home page or wherever you want
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});








/* GET admin transport details page. */
router.get('/admintransportdetails', function (req, res) {
  res.render('admintransportdetails');
});


/* GET front page. */
router.get('/', function (req, res, next) {
  res.render('frontpage');
});


/* GET admin info update  page. */
router.get('/adminupdateinfo', function (req, res, next) {
  res.render('adminupdateinfo');
});


/* GET user page. */
router.get('/userpage', function (req, res, next) {
  res.render('userpage');
});




/* GET history all complaints page. */
router.get('/studentcomplainthistory',async function (req, res, next) {

let comp2 = await complaintSchema.find({registrationnumber:check.registrationNumber});
await console.log(comp2);
  res.render('studentcomplainthistory',{comp2});
});

module.exports = router;
