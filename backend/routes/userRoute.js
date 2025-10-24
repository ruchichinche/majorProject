import express from 'express'

import { getProfile, loginUser, registerUser, updateProfile,bookAppointment } from '../Controllers/UserController.js'
import { getMyAppointments, cancelAppointment } from '../Controllers/UserController.js'
import authUser from '../middlewares/authUser.js'
import upload from '../middlewares/multer.js'

const userRouter=express.Router()

userRouter.post('/register',registerUser)
userRouter.post('/login',loginUser)
userRouter.get('/get-profile', authUser, getProfile)
// Run authUser before multer so req.userId is available and request is authorized
userRouter.post('/update-profile', authUser, upload.single('image'), updateProfile)
userRouter.post('/book-appointment',authUser,bookAppointment)
userRouter.get('/my-appointments', authUser, getMyAppointments)
userRouter.post('/cancel-appointment', authUser, cancelAppointment)
export default userRouter