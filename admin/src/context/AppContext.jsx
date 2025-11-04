import { createContext } from "react";

export const AppContext=createContext()

const AppContextProvider=(props)=>{
    const currency='$'
    const calculateAge=(dob)=>{ 
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        return age;
        }
const value={
calculateAge,currency
}


return(
    <AppContext.Provider value={value}>
    {props.children}

</AppContext.Provider>
)
}

export default AppContextProvider 