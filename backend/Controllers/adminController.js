


import validator from 'validator';
 import bcrypt from 'bcrypt';
 import {v2 as cloudinary} from 'cloudinary';
import doctorModel from '../models/doctorModel.js';
import jwt from 'jsonwebtoken';
import appointmentModel from '../models/appointmentModel.js';
import userModel from '../models/userModel.js';


// API for adding doctor
const addDoctor = async (req, res) => {
try {
  // Debug: log content-type, body and file to help diagnose upload issues
  console.log('Content-Type:', req.headers['content-type']);
  console.log('req.body keys:', Object.keys(req.body || {}));
  console.log('req.file:', req.file);

  const { name, email, password, speciality, degree, experience, about, fees, address } = req.body;
  const imageFile = req.file;
//check all fields are provided
if(!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address ){
    return res.json({sucess:false ,message:"All fields are required"})
}
//check valid email
if(!validator.isEmail(email)){
return res.json({sucess:false ,message:"please enter the valid Email"})
}

//vadating password length
if(password.length<8){
return res.json({success:false ,message:"password must be at least 8 characters"})
}
//hashing password
const salt= await bcrypt.genSalt(10)
const hashedPassword=await bcrypt.hash(password,salt)

// if image is missing, return a helpful error
if (!imageFile) {
  return res.status(400).json({ sucess: false, message: 'Image file missing. Make sure you send form-data with a file field named "image" and do NOT set Content-Type header manually.' });
}
//uploading image to cloudinary
const imageUpload= await cloudinary.uploader.upload(imageFile.path,{resource_type:"image"})
const imageUrl= imageUpload.secure_url;
const doctorData={
    name,
    email,
    image:imageUrl,
    password:hashedPassword,
    speciality,
    degree,
    experience,   
    about,    
    fees,
    address:JSON.parse(address),
    date:Date.now()
}
const newDoctor=new doctorModel(doctorData)
await newDoctor.save()
res.json({sucess:true ,message:"Doctor added sucessfully"})
}
catch (error) {
console.log(error);
res.json({ sucess:false ,message: error.message });
}}

//api for the admin login
const loginAdmin =async(req,res)=>{
try{
const{email,password}=req.body
if(email===process.env.ADMIN_EMAIL && password===process.env.ADMIN_PASSWORD){
  const token=jwt.sign(email+password,process.env.JWT_SECRET)
  res.json({sucess:true ,token})
}
else{
  res.json({sucess:false ,message:"Invalid credentials"})
}
}
catch (error) {
    console.log(error);
    res.json({ success:false ,message: error.message });
  }
}

//api to get all doctors list for admin panel

const allDoctors=async(req,res)=>{
  try{
    const doctors=await doctorModel.find({}).select('-password')
    res.json({success:true,doctors})
  }
  catch(error){
    console.log(error);
    res.json({ sucess:false ,message: error.message });
  }
}
// get all appointments for admin panel
const appointmentsAdmin=async(req,res)=>{
  try{
    // Assuming appointmentModel is imported and defined
    const appointments=await appointmentModel.find({})
.populate("doctorId","name speciality")
      .populate("userId","name age");

    res.json({success:true,appointments})
  } catch(error){
    console.log(error);
    res.json({ success:false ,message: error.message });
  }}

//API appointments cancel by admin
// API: cancel appointment by admin
const appointmentCancel = async (req, res) => {
    try {
        const { appointmentId } = req.body;

        if (!appointmentId) {
          return res.status(400).json({ success: false, message: "Missing appointmentId" });
        }

        const appointment = await appointmentModel.findById(appointmentId);
        if (!appointment) {
          return res.status(404).json({ success: false, message: "Appointment not found" });
        }

        const docId = appointment.doctorId;
        const slotDate = appointment.slotDate;
        const slotTime = appointment.slotTime;

        // free up doctor slot
        if (docId) {
            const doc = await doctorModel.findById(docId);

            if (doc) {
                let slots_booked = doc.slots_booked || {};
                if (Array.isArray(slots_booked[slotDate])) {
                    slots_booked[slotDate] = slots_booked[slotDate].filter(t => t !== slotTime);
                    await doctorModel.findByIdAndUpdate(docId, { slots_booked });
                }
            }
        }

        // mark appointment cancelled (recommended)
        appointment.cancelled = true;
        await appointment.save();

        return res.json({ success: true, message: "Appointment cancelled" });
    } catch (error) {
        console.log("cancelAppointment error:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};


//API to get dashboard data for admin panel
const adminDashboard=async(req,res)=>{
try{

  const doctors=await doctorModel.find({})
  const users=await userModel.find({})
const appointments=await appointmentModel.find({})
const dashData={
  doctors:doctors.length,
  Patients:users.length,
  appointments:appointments.length,
  latestAppointments:appointments.slice(0,5).reverse()
}
res.json({success:true,dashData})


}catch(error){    
    console.log(error);
    res.json({ success:false ,message: error.message });
}
}

export { addDoctor,loginAdmin ,allDoctors,appointmentsAdmin,appointmentCancel,adminDashboard} 