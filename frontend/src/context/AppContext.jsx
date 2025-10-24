import { createContext, useEffect, useState } from "react";
import axios from 'axios'
import { toast } from "react-toastify";
export const AppContext=createContext()

const AppContextProvider=(props)=>{

    const currencySymbol='$'
    const backendUrl=import.meta.env.VITE_BACKEND_URL
    const [doctors, setDoctors] = useState([]);
    const [token, setToken] = useState(localStorage.getItem('token') || null);

    const [userData, setUserData] = useState(false);

 const getDoctorsData=async()=>{
    try{
        const{data}=await axios.get(backendUrl+'/api/doctor/list')
            if(data.success){
            setDoctors(data.doctors)
            }else{
                toast.error(data.error)
            }
        

    }catch (error)
    {
console.log(error);
toast.error(error.message)

    }
 }

const loadUserProfileData = async () => {
    try {
        const { data } = await axios.get(backendUrl + '/api/user/get-profile', {
            headers: { Authorization: token ? `Bearer ${token}` : '' },
        });

        if (data && data.success) {
            setUserData(data.userData);
        } else {
            toast.error((data && (data.message || data.error)) || 'Failed to load profile');
        }
    } catch (error) {
        console.log(error);
        toast.error(error.message || 'Failed to load profile');
    }
};

const updateUserProfile = async (updates) => {
    try {
        console.log('updateUserProfile called with', updates);
        const isForm = (typeof FormData !== 'undefined') && (updates instanceof FormData);
        const config = {
            headers: { Authorization: token ? `Bearer ${token}` : '' },
        };
        if (!isForm) config.headers['Content-Type'] = 'application/json';

        const { data } = await axios.post(backendUrl + '/api/user/update-profile', updates, config);
        console.log('updateUserProfile response', data);
        if (data && data.success) {
            // refresh profile from server to ensure latest shape
            await loadUserProfileData();
            toast.success('Profile updated');
            return { success: true, data };
        }
        toast.error((data && (data.message || data.error)) || 'Update failed');
        return { success: false, data };
    } catch (error) {
        console.log(error);
        toast.error(error.message || 'Update failed');
        return { success: false, error };
    }
};

 const value={
doctors,getDoctorsData,
currencySymbol,
token,setToken,
backendUrl,
userData,setUserData,
loadUserProfileData,
updateUserProfile
    }

 useEffect(()=>{
    getDoctorsData()
 },[])

useEffect(()=>{
    if(token){
loadUserProfileData()
    }else{
        setUserData(false)
    }
},[token])

    return(
        <AppContext.Provider  value={value}>
            {props.children}
        </AppContext.Provider>
    )
}
export default AppContextProvider;