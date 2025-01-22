import { BrowserRouter, Route, Routes } from "react-router-dom"
import { HomePage } from "./views/HomePage"
import { ComponentPage } from "./views/ComponentPage"
import { NotFoundPage } from "./views/NotFoundPage"
import { StaffLayout } from "./components/StaffLayout"
import { Test } from "./Test"
import { HomePageContent } from "./views/HomePageContent"
import { ViewProduct } from "./views/ViewProduct"
import { CartPage } from "./views/CartPage"
export const Router = () => {
  return (
   <BrowserRouter>
      <Routes>
         <Route path="/" element={<HomePage/>}>
         <Route path ="/" element={<HomePageContent/>}/>
         <Route path="/components" element={<ComponentPage/>}/>
         <Route path="/components/:id" element={<ViewProduct/>}/>
         <Route path="/cart" element={<CartPage/>}/>
         
         </Route>
         <Route path="/test" element={<Test/>}/>
         <Route path="/staff" element={<StaffLayout/>}/>
         <Route path="*" element={<NotFoundPage/>}/>
      </Routes>
   </BrowserRouter>
  )
}
