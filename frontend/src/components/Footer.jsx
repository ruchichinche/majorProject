import React from "react";
import { assets } from "../assets/assets";

const Footer=()=>{
    return(
        <div className="md:mx-10">
<div className=" flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-15 my-10 mt-40 text-sm ">
    {/* ....Left Section */}
    <div>
        <img className="mb-5 w-40" src={assets.logo} alt="" />
        <p className="w-full md:w-2/3 text-gray-600 leading-6">Allows clients to easily view your availability and book appointments directly through your website or social media pages.</p>

    </div>
    {/* ....center Section... */}
    <div>
<p className="text-xl font-medium mb-5">COMPANY</p>
<ul className="flex  flex-col gap-2 text-gray-600 ">
    <li>Home</li>
    <li>About us</li>
    <li>Contact Us</li>
    <li> Privacy policy</li>
</ul>
    </div>
    {/* .....right section... */}
    <div>
<p className="text-xl font-medium mb-5">GET IN TOUCH</p>
<ul className="flex  flex-col gap-2 text-gray-600 ">
    <li>+91-123-456-7890</li>
    <li>abc@gmail.com</li>
</ul>
    </div>
</div>
{/* ...copyrightby.... */}
<div >
    <hr />
    <p className="py-5 text-sm text-center font-semibold "> @Project by 4 Star's group</p>
</div>
        </div>
    )
}
export default Footer;