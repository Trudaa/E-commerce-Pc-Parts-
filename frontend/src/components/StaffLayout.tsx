import { Navigate } from "react-router-dom"
import { useStateContext } from "../context/ContextProvider"    

export const StaffLayout = () => {
  
    const {user} = useStateContext()
  
     
    if(user.role !=="staff" || user == "null") 
        return <Navigate to='/' />

  return (
    <div>StaffLayout</div>
  )
}
