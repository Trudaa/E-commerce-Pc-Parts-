import { Navigate } from "react-router-dom"
import { useStateContext } from "../context/ContextProvider"    
import axiosApi from "../axiosApi"
import { useEffect, useState } from "react"

export const StaffLayout = () => {
  
    const {user} = useStateContext()
    const [userRole,setUserRole] = useState<string | null>(null)

    useEffect(() => {
      getUserRole()
    })
    const getUserRole = () =>{ 
      axiosApi.get(`/users/${user?.id}`)
      .then((response) =>{
        setUserRole(response.data)
        
      }) 
      .catch((error) =>{
        console.log(error)
      })
    }
    
    if(userRole !=="staff" && user == null   ) 
        return <Navigate to='/' />

  return (
    <div>StaffLayout</div>
  )
}
