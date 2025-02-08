import { BrowserRouter, Route, Routes } from "react-router-dom"
import { HomePage } from "./views/HomePage"
import { ComponentPage } from "./views/ComponentPage"
import { NotFoundPage } from "./views/NotFoundPage"
import { StaffLayout } from "./components/StaffLayout"
import { Test } from "./Test"
import { HomePageContent } from "./views/HomePageContent"
import { ViewProduct } from "./views/ViewProduct"
import { CartPage } from "./views/CartPage"
import { useStateContext } from "./context/ContextProvider"
import { useEffect, useState } from "react"
import axiosApi from "./axiosApi"

export const Router = () => {
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


  return (
   <BrowserRouter>
      <Routes>
         <Route path="/" element={<HomePage/>}>
            <Route path ="/" element={<HomePageContent/>}/>
            <Route path="/components" element={<ComponentPage/>}/>
            <Route path="/components/:id" element={<ViewProduct/>}/>
            {user ==null? (
            <Route path="*" element={<NotFoundPage />} />
            ) : ( 
            <Route path="/cart" element={<CartPage />} />  )}
         </Route>
        
         <Route path="/test" element={<Test/>}/>
         {userRole ==="staff" ? (
         <Route path="/staff" element={<StaffLayout/>}/>
         ) : (  
         <Route path="/*" element={<NotFoundPage/>}/>)}
         <Route path="*" element={<NotFoundPage/>}/>
      </Routes>
   </BrowserRouter>
  )
}
