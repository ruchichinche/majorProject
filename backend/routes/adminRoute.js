import express from 'express'
import { addDoctor,adminDashboard,allDoctors,appointmentCancel,appointmentsAdmin,loginAdmin } from '../Controllers/adminController.js'
import upload from '../middlewares/multer.js'
import authAdmin from '../middlewares/authAdmin.js'
import { changeAvailablity } from '../Controllers/doctorController.js';

const adminRouter=express.Router();

//consfig multer for file upload


// normal protected route
adminRouter.post('/add-doctor',authAdmin,upload.single("image"),addDoctor)
// debug/test route (no auth) to verify multer and client upload behavior
adminRouter.post('/add-doctor-test', upload.single('image'), (req, res) => {
	console.log('Test route received content-type:', req.headers['content-type']);
	console.log('Test req.file:', req.file);
	console.log('Test req.body keys:', Object.keys(req.body || {}));
	if (!req.file) return res.status(400).json({ success: false, message: 'No file received' });
	return res.json({ success: true, message: 'File received', file: req.file });
});
adminRouter.post('/login',loginAdmin)
adminRouter.post('/all-doctors',authAdmin,allDoctors)
adminRouter.post('/change-avalibility',authAdmin,changeAvailablity)
adminRouter.get('/appointments',authAdmin,appointmentsAdmin)
adminRouter.post('/cancel-appointment',authAdmin,appointmentCancel)
adminRouter.get('/dashboard',authAdmin,adminDashboard)
export default adminRouter