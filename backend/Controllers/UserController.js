


import validator from 'validator'
 import bcrypt from 'bcrypt';
import userModel from '../models/userModel.js';
import jwt from 'jsonwebtoken'
import{v2 as cloudinary} from 'cloudinary'
import doctorModel from '../models/doctorModel.js';
import appointmentModel from '../models/appointmentModel.js';

//api to register user 
const registerUser=async(req,res)=>{
    try{

const{name,email,password}=req.body
if(!name || !password || !email ){
return res.json({success:false,message:"Missing Details"})
}

//check valid email

if(!validator.isEmail(email)){
return res.json({success:false,message:"enter a valid email"})

}
//vadating password length
if(password.length<8){
return res.json({success:false ,message:"password must be at least 8 characters"})
}
//hashing password
const salt= await bcrypt.genSalt(10)
const hashedPassword=await bcrypt.hash(password,salt)

const userData={
    name,
    email,
    password:hashedPassword
}

const newUser = new userModel(userData)
const user =await newUser.save()

const token =jwt.sign({id:user._id}, process.env.JWT_SECRET)

res.json({success:true,token})

    }catch(error){
console.log(error);
    res.json({ success:false ,message: error.message });
    }
} 

//Api for user login
const loginUser=async(req,res)=>
{
    try{
        const{email,password}=req.body
        const user=await userModel.findOne({email})

        if(!user){
   return res.json({ success:false ,message:'User not exit ' });
 }
    
const isMatch=await bcrypt.compare(password,user.password)
if(isMatch){
    const token =jwt.sign({id:user._id},process.env.JWT_SECRET)
    res.json({success:true,token})
}else{
    res.json({success:false,message:"Invalid Cardintials"})
}

    }catch(error){
console.log(error);
    res.json({ success:false ,message: error.message });
    }
}
//api to get user profile data
const getProfile=async(req,res)=>{
try{
const{userId }=req
const userData=await userModel.findById(userId).select('-password')

res.json({success:true,userData})

}catch(error){
console.log(error);
    res.json({ success:false ,message: error.message });
}
}

// API to update user Profile
const updateProfile = async (req, res) => {
    try {
        const { userId } = req;
        // Debug logs to help diagnose missing phone updates
        console.log('updateProfile called - userId:', userId);
        console.log('updateProfile headers (authorization/token):', {
            authorization: req.headers.authorization,
            token: req.headers.token,
        });
        console.log('updateProfile raw body keys:', Object.keys(req.body || {}));
        if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized: missing userId' });

        // Read fields from body (support partial updates)
        const { name, phone, address, dob, gender } = req.body || {};
        console.log('updateProfile body values:', { name, phone, address, dob, gender, file: !!req.file });
        const imageFile = req.file;

        const updates = {};
        if (typeof name !== 'undefined' && name !== '') updates.name = name;
        if (typeof phone !== 'undefined' && phone !== '') updates.phone = phone;
        if (typeof dob !== 'undefined' && dob !== '') updates.dob = dob;
        if (typeof gender !== 'undefined' && gender !== '') updates.gender = gender;

        if (typeof address !== 'undefined' && address !== '') {
            try {
                updates.address = typeof address === 'string' ? JSON.parse(address) : address;
            } catch (e) {
                console.log('address parse error:', e.message);
                return res.status(400).json({ success: false, message: 'Invalid address format' });
            }
        }

        if (imageFile) {
            try {
                const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: 'image' });
                updates.image = imageUpload.secure_url;
            } catch (e) {
                console.log('cloudinary upload error:', e.message);
                return res.status(500).json({ success: false, message: 'Image upload failed' });
            }
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ success: false, message: 'No update fields provided' });
        }

        const updatedUser = await userModel.findByIdAndUpdate(userId, updates, { new: true }).select('-password');
        if (!updatedUser) return res.status(404).json({ success: false, message: 'User not found' });

        console.log('updateProfile: saved phone ->', updatedUser.phone);
        return res.json({ success: true, message: 'Profile Updated', user: updatedUser });
    } catch (error) {
        console.log('updateProfile error:', error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

//Api to book appointment
const bookAppointment = async (req, res) => {
    try {
        console.log('bookAppointment called - body:', req.body);
        // userId comes from auth middleware
        const userId = req.userId;
        const { docId, slotDate, slotTime } = req.body;

        if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });
        if (!docId || !slotDate || !slotTime) return res.status(400).json({ success: false, message: 'Missing booking fields' });

        const docData = await doctorModel.findById(docId).select('-password');
        if (!docData) return res.status(404).json({ success: false, message: 'Doctor not found' });

        if (!docData.available) {
            return res.json({ success: false, message: 'Slot not available' });
        }

        // ensure slots_booked is an object
        let slots_booked = docData.slots_booked || {};
        console.log('bookAppointment: before slots_booked', slots_booked);

        // ensure the slotDate entry is an array
        if (!Array.isArray(slots_booked[slotDate])) {
            slots_booked[slotDate] = [];
        }

        // checking for slot availability
        if (slots_booked[slotDate].includes(slotTime)) {
            return res.json({ success: false, message: 'doctor not available' });
        }

        // reserve the slot
        slots_booked[slotDate].push(slotTime);
        console.log('bookAppointment: after slots_booked', slots_booked);

        const userData = await userModel.findById(userId).select('-password');
        delete docData.slots_booked;

        const appointmentData = {
            userId,
            doctorId: docId,
            userData,
            doctorData: docData,
            amount: docData.fees,
            slotTime,
            slotDate,
            date: Date.now(),
        };

        const newAppointment = new appointmentModel(appointmentData);
        await newAppointment.save();

        // save new slots data in docData
        await doctorModel.findByIdAndUpdate(docId, { slots_booked });

        res.json({ success: true, message: 'Appointment booked' });
    } catch (error) {
        console.log('bookAppointment error:', error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

// API to get logged-in user's appointments
const getMyAppointments = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

        // find appointments for the user, newest first
        const appointments = await appointmentModel.find({ userId }).sort({ date: -1 });
        return res.json({ success: true, appointments });
    } catch (error) {
        console.log('getMyAppointments error:', error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

// API to cancel an appointment
const cancelAppointment = async (req, res) => {
    try {
        const userId = req.userId;
        const { appointmentId } = req.body;
        if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });
        if (!appointmentId) return res.status(400).json({ success: false, message: 'Missing appointmentId' });

        const appointment = await appointmentModel.findById(appointmentId);
        if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });
        if (String(appointment.userId) !== String(userId)) return res.status(403).json({ success: false, message: 'Forbidden' });

        // free up the doctor's booked slot if present
        const docId = appointment.doctorId;
        const slotDate = appointment.slotDate;
        const slotTime = appointment.slotTime;

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

        await appointmentModel.findByIdAndDelete(appointmentId);
        return res.json({ success: true, message: 'Appointment cancelled' });
    } catch (error) {
        console.log('cancelAppointment error:', error);
        return res.status(500).json({ success: false, message: error.message });
    }
};
export {registerUser, loginUser, getProfile, updateProfile, bookAppointment, getMyAppointments, cancelAppointment}