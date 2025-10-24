


import validator from 'validator';
 import bcrypt from 'bcrypt';
 import {v2 as cloudinary} from 'cloudinary';
import doctorModel from '../models/doctorModel.js';
import jwt from 'jsonwebtoken';
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
    res.json({ sucess:false ,message: error.message });
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

export { addDoctor,loginAdmin ,allDoctors} 