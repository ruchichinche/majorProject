import { doctorList } from "../Controllers/doctorController.js"
import express from "express";

const doctorRouter=express.Router()
doctorRouter.get('/list',doctorList)

export default doctorRouter