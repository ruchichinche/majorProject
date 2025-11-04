import React from "react";
import { assets } from "../assets/assets";

const About=()=>{
    return(
        <div>

            <div className="text-center text-2xl pt-10  text-gray-500">
                <p>
                    ABOUT <span className="text-gray-700 font-medium">System</span>
                </p>
            </div>
            <div className="my-10  flex flex-col md:flex-row gap-12">
                <img className="w-full md:max-w-[360px]" src={assets.about_image} alt="" />
                <div className="flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600 ">
                    <p>Online doctor appointment booking uses web or mobile platforms to connect patients with healthcare providers for virtual or in-person consultations, streamlining the scheduling process. These services offer convenience and accessibility while providing tools for everything from finding a specialist to receiving prescriptions</p>
                    <p>  Book appointments 24/7 from anywhere.
Reduces phone calls and back-and-forth communication.
 Easily access doctor details, locations, and patient feedback. Receive automated SMS and email notifications for appointment status. Choose between in-person or virtual consultations.  </p>
            Convenience: Book appointments 24/7 from anywhere.<br></br>
Efficiency: Reduces phone calls and back-and-forth communication.<br></br>
Information: Easily access doctor details, locations, and patient feedback.<br></br>
Reminders: Receive automated SMS and email notifications for appointment status.<br></br>
Flexibility: Choose between in-person or virtual consultations.         <b className="text-gray-800>Our vision">Our Vision</b>
    <p>Online doctor appointment booking services generally share a vision of making healthcare more accessible, efficient, and patient-centric through technology. The specific vision for a booking platform can be built around these core principles to reflect a company's specific goals.   </p>
                </div>
            </div>
            
        </div>
    )
}
export default About;