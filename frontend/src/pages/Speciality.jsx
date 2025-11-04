import React from "react";
import { assets } from "../assets/assets";

const Speciality =()=>{
    const roles = [
    { id: 1, text: "Primary Healthcare Provider", color: "bg-yellow-400" },
    { id: 2, text: "Health Monitoring and Management", color: "bg-orange-500" },
    { id: 3, text: "Preventive Care and Screenings", color: "bg-cyan-500" },
    { id: 4, text: "Diagnosis and Treatment", color: "bg-blue-500" },
    { id: 5, text: "Referral to Specialists", color: "bg-purple-500" },
    { id: 6, text: "Patient Education and Counseling", color: "bg-green-500" },
  ];
    return(
        <div>
        <div className="bg-white text-gray-800 px-6 md:px-20 py-12 leading-relaxed">
      {/* Intro Section */}
      <p className="text-base md:text-lg text-gray-700 mb-6">
        When it comes to taking care of your health, finding the{" "}
        <strong>best general physician in Chennai</strong> is essential. A general
        physician is often your first point of contact for any medical concerns,
        as they specialize in diagnosing a wide range of health conditions. They
        can treat anything from minor illnesses like the common cold to managing
        chronic conditions like diabetes or hypertension. In this blog, we’ll
        introduce some of the best general physicians in Ayapakkam and the types
        of services they provide.
      </p>

      {/* Heading */}
      <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-4">
        Best General Physician 
      </h2>

      {/* Description */}
      <p className="text-base md:text-lg text-gray-700">
        If you’re looking for the best general physician , you’re in the
        right place. Chennai is home to some of the finest general medicine doctors,
        offering exceptional healthcare services. General physicians play a
        critical role in preventive care, early diagnosis, and treatment of a wide
        array of medical conditions. They guide you through all stages of your
        healthcare journey, ensuring you receive the right treatment at the right
        time.
      </p>
       <div className="bg-white py-12 px-6 md:px-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-10">
        {/* Logo and Image */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <img 
            src={assets.contact1_image}
            alt=""
            className="w-64 md:w-80 mb-6 md:mb-0  flex items-center gap-4 transition-transform hover:scale-105"
            
          />
        </div>

        {/* Title and Roles */}
        <div className="md:w-2/3">
          <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-8 text-center md:text-left">
            Role of General Physicians
          </h2>

          <div className="space-y-4">
            {roles.map((role) => (
              <div
                key={role.id}
                className="flex items-center gap-4 transition-transform hover:scale-105"
              >
                {/* Number Badge */}
                <div
                  className={`${role.color} text-white font-bold text-lg w-10 h-10 flex items-center justify-center rounded-full shadow-md`}
                >
                  {role.id}
                </div>

                {/* Role Text */}
                <div
                  className={`${role.color} text-white rounded-md px-4 py-3 flex-1 font-medium`}
                >
                  {role.text}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    </div>



    <section className="bg-teal-600 text-white py-10">
      <div className="container mx-auto px-6 text-center">
        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-bold mb-10">
          Obstetrics And Gynecology
        </h2>

        {/* Image */}
        <div className="bg-white rounded-md shadow-md overflow-hidden inline-block">
          <img
            src={assets.gynology}
            alt="Obstetrics and Gynecology"
            className="w-full md:w-[800px] h-auto mx-auto"
          />
        </div>
        
        <div className="min-h-screen bg-gray-50 text-gray-800 p-6 md:p-12">
<div className="max-w-4xl mx-auto">
<h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
Difference Between Obstetrics And Gynecology
</h1>


<p className="mb-6 leading-relaxed">
Women’s bodies have unique hormone-regulated cycles and processes, such as menstruation and menopause. Birth control and fertility
issues belong to the reproductive system and are major concerns for women of childbearing age. Women require medical examination
for certain conditions, including pelvic organ disease, breast cancer, or other gynecological issues. During pregnancy, women
need delicate and specialized medical care in terms of treatment and medicine, which is handled by specialists in the OB/GYN
domain.
</p>


<p className="mb-10 leading-relaxed">
First, we need to understand medical terms that sound similar but refer to different specializations. In this blog, we explain
the <strong>difference between obstetrics and gynecology</strong>. If you are curious about what OB/GYN means — which stands
for obstetrics and gynecology — read carefully to understand how they support women's reproductive health and pregnancy.
</p>


<h2 className="text-2xl md:text-3xl font-semibold mb-4 text-gray-900">What is OB/GYN?</h2>
<p className="mb-6 leading-relaxed">
OB/GYN refers to a medical professional trained in both obstetrics and gynecology. Obstetrics focuses on pregnancy, childbirth,
and postpartum care. Gynecology deals with the health and diseases of the female reproductive system. Together, obstetricians
and gynecologists play a crucial role in women’s healthcare. OB/GYN specialists may treat women of all ages, including young and
adult women.
</p>


<p className="mb-10 leading-relaxed">
Below, we will explain the difference between gynecology and obstetrics in detail and help you understand the essential role of
OB/GYN in women's health. You can also use this knowledge to find the <strong>best obstetrics and gynecology near you</strong>.
</p>
</div>
</div>
      
      </div>
    </section>

<br />
<div className="container mx-auto px-6 text-center">
  <br />
  <h1 className="text-2xl md:text-3xl font-semibold mb-4 text-gray-900">1. Primary Healthcare Provider</h1>
  <p className="mb-10 leading-relaxed">Primary healthcare providers are the first point of contact for patients. They offer routine care, handle common health concerns, and build long-term patient relationships to support overall wellness.</p>
</div>



<div className="container mx-auto px-6 text-center">
  <br />
  <h1 className="text-2xl md:text-3xl font-semibold mb-4 text-gray-900">2. Health Monitoring and Management</h1>
  <p className="mb-10 leading-relaxed">They continuously monitor patient health, track chronic conditions like diabetes or hypertension, and ensure treatment plans are working effectively to maintain optimal health.</p>
</div>

<div className="container mx-auto px-6 text-center">
  <br />
  <h1 className="text-2xl md:text-3xl font-semibold mb-4 text-gray-900">3. Preventive Care and Screenings</h1>
  <p className="mb-10 leading-relaxed">Preventive care includes regular health checkups, vaccinations, medical screenings, and early-detection tests to prevent diseases before they become serious.</p>
</div>

<div className="container mx-auto px-6 text-center">
  <br />
  <h1 className="text-2xl md:text-3xl font-semibold mb-4 text-gray-900">4. Diagnosis and Treatment</h1>
  <p className="mb-10 leading-relaxed">Primary care doctors diagnose common illnesses, injuries, infections, and medical issues, and provide timely treatment to restore health and prevent complications.</p>
</div>

    </div>
    )
}
export default Speciality ;