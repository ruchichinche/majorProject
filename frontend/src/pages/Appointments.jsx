import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import RelatedDoctors from "../components/RelatedDoctors";
import { toast } from "react-toastify";
const Appointment = () =>{
    const{docId}=useParams()
    const{doctors, currencySymbol,backendUrl,token,getDoctorsData}=useContext(AppContext)
    const daysOfWeek=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]

    const navigate =useNavigate()

    const[docInfo,setDocInfo]=useState(null)

    const [docSlots,setDocSlots]=useState([])

    const[slotIndex,setSlotIndex]=useState(0)

    const[slotTime,setSlotTime]=useState("")

    const fetchDocInfo=async()=>{
        const docInfo=doctors.find(doc => doc._id === docId)
        setDocInfo(docInfo)
    
    }
     
    const getAvailableSlots=async()=>{
        setDocSlots([])
        //getting current date and time
        let today=new Date()
        for(let i=0;i<7;i++){
            let currentDate=new Date(today)
            currentDate.setDate(today.getDate()+i)
            //setting the time to 0:0:0
            let endTime=new Date()
            endTime.setDate(today.getDate()+i)
            endTime.setHours(21,0,0,0)
            //settind hours
            if(today.getDay()===currentDate.getDay()){
                currentDate.setHours(currentDate.getHours()>10?currentDate.getHours()+1:10)
            }else{
                currentDate.setHours(10)
                currentDate.setMinutes(0)
            }
            let timeSlots=[] 
            while (currentDate < endTime) {
                let formatedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                // build ISO date string YYYY-MM-DD to match backend
                const year = currentDate.getFullYear();
                const month = String(currentDate.getMonth() + 1).padStart(2, '0');
                const day = String(currentDate.getDate()).padStart(2, '0');
                const slotDate = `${year}-${month}-${day}`;
                const slotTime = formatedTime;

                // checking if the slot is already booked (safe access)
                const bookedForDay = (docInfo && docInfo.slots_booked && Array.isArray(docInfo.slots_booked[slotDate]))
                    ? docInfo.slots_booked[slotDate]
                    : [];
                const isSlotAvailable = !bookedForDay.includes(slotTime);

                if (isSlotAvailable) {
                    timeSlots.push({
                        datetime: new Date(currentDate),
                        time: formatedTime,
                    });
                }

           
            //Increment the time by 30 mins
            currentDate.setMinutes(currentDate.getMinutes()+30)
            }
            setDocSlots(prev=>([...prev,timeSlots]))
        }
    }
    const bookAppointment = async () => {
        if (!token) {
            toast.warn('Login to book appointment');
            return navigate('/login');
        }

        try {
            // slotDate should be in a format matching the backend expectation
            // validate selected date and time
            if (!docSlots || !Array.isArray(docSlots) || docSlots.length === 0) {
                toast.warn('No available slots for this doctor');
                return;
            }

            if (typeof slotIndex !== 'number' || !docSlots[slotIndex] || !docSlots[slotIndex][0]) {
                toast.warn('Please select a booking date');
                return;
            }

            if (!slotTime) {
                toast.warn('Please select a time slot');
                return;
            }

            const slotDate = docSlots[slotIndex][0].datetime
                ? docSlots[slotIndex][0].datetime.toISOString().split('T')[0]
                : null;

            if (!slotDate) {
                toast.warn('Invalid booking date');
                return;
            }

            const payload = { docId, slotDate, slotTime };

            // log the payload so you can inspect it in DevTools Network/Console
            console.log('Booking payload:', payload);

            const response = await fetch(backendUrl + '/api/user/book-appointment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token ? `Bearer ${token}` : '',
                },
                body: JSON.stringify(payload),
            });

            // parse JSON body
            const data = await response.json().catch(() => null);

            if (!data) {
                toast.error('No response from server');
                return;
            }

            // prefer backend-provided message and status; if response not ok, show error
            if (!response.ok || !data.success) {
                toast.error(data.message || 'Booking failed');
                return;
            }

            // success: show toast and navigate
            toast.success(data.message || 'Appointment booked');
            // navigate to user's appointments
            navigate('/my-appointments');
        } catch (error) {
            console.error('bookAppointment error', error);
            toast.error(error.message || 'Booking failed');
        }
    }




    useEffect(()=>{
        fetchDocInfo()
    },[doctors,docId])

        useEffect(()=>{
        getAvailableSlots()
       
        },[docInfo])

        useEffect(()=>{
       console.log(docSlots);
        },[docSlots])

    return docInfo &&(
        <div>   
            {/* You can render docInfo here if needed */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div>
                    <img className="bg-primary w-full sm:max-w-72 rounded-lg" src={docInfo.image} alt="" />
                </div>
                <div className="flex-1 border border-gray-400 ronded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0 " >
                    <p className="flex items-center gap-2 text-2xl font-medium text-gray-900">{docInfo.name} <  img className="w-5" src={assets.verified_icon}/></p>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                    <p>{docInfo.degree}:{docInfo.speciality}</p>
                    <button className="py-0.5 px-2 border text-xs rounded-full ">{docInfo.experience} </button>
                    </div>
                {/* ...Doctors About... */}
                <div>
                    <p className=" flex items-center gap-1 text-sm font-medium text-gray-900 mt-3 "> About <img className="w-3"  src={assets.info_icon} alt="" /></p>
                    <p className="text-sm text-gray-500 max-w-[700px] mt-1">{docInfo.about}</p>
                </div>
                <p className="text-gary-500 font-medium mt-4"> Appointment fee:
                    <span className="text-lg font-medium text-gray-600">{docInfo.fees}{currencySymbol}</span>
                </p>
                </div>
            </div>
            {/* ...Booking Slots... */}
            <div className="sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700">
                <p>
                    Booking Slots
                </p>
                <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4" >
                    {
                        docSlots.length && docSlots.map((item,index)=>(

                      <div onClick={()=>setSlotIndex(index)} className={`text-center py-6 min-w-16 rounded-full cousor-pointer ${slotIndex===index? 'bg-primary text-white':'border border-gray-200'}`} key={index}>
                        <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
                        <p>{item[0]&& item[0].datetime.getDate()}</p>
                      </div>
                        ))
                    }
                </div>
                  <div className="flex items-center gap-3 w-full overflow-x-scroll mt-4">
                    {
                        docSlots.length && docSlots[slotIndex].map((item,index)=>(
                            <p onClick={()=>setSlotTime(item.time)} className={`text-sm font-light  flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time===slotTime? 'bg-primary text-white':'text-gray-400 border border-gray-300' } `} key={index}>
                                {
                                    item.time.toLowerCase()
                                }
                            </p>
                        ))
                    }
                  </div>
                  <button onClick={bookAppointment} className="bg-primary text-white rounded-full text-sm font-light px-14 py-3 my-6">Book & Appointment</button>
            </div>
            {/* ...Listedn Related Doctors... */}
            <RelatedDoctors docId={docId} speciality={docInfo.speciality}/>
        </div>
    )
}
export default Appointment;