import { useState } from "react"
import axiosApi from "../axiosApi"
import Swal from "sweetalert2"
type LoginProps = {
  handleLoginClick: () => void
  handleModalClick: () => void
}
export const Signup = ({handleLoginClick,handleModalClick}:LoginProps) => {
  const [signupDetails, setSignupDetails] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
  })


  console.log("signupDetails",signupDetails)
  
  const handleSignup = (e:any) => {
    e.preventDefault()
    axiosApi.post('/signup', signupDetails)
      .then((response) => {
        handleLoginClick()
        Swal.fire({
          title: "Account Created",
          text: response?.data?.message || "Account created successfully.",
          icon: "success",
          confirmButtonText: "OK",
      })
        
      })
      .catch((error) => {
       Swal.fire({
               title: "Account Creation Failed",
               text: error.response?.data?.message || "Something went wrong. Please try again.",
               icon: "error",
               confirmButtonText: "OK",
           })
      })
  }

  const handleChange = (e: any) => {
    setSignupDetails({
      ...signupDetails,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-96 bg-white shadow-lg rounded-lg p-6 relative">
        <button
         onClick={handleModalClick}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">Signup</h2>
        <p className="text-center text-gray-500 mb-6">Create your account</p>
        <form onSubmit={handleSignup}>
        <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
             Name
            </label>
            <input
              type="text"
              name="name"
              value = {signupDetails.name}
              onChange = {handleChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
              placeholder="Enter your name"
            />
          </div>
         
           <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value = {signupDetails.email}
              onChange = {handleChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
              placeholder="Enter your email"
            />
          </div>
         
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              value = {signupDetails.password}
              onChange = {handleChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
              placeholder="Enter your password"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              type="password"
              name="password_confirmation"
              onChange = {handleChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-md"
          >
            Signup
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-500">Already have an account? <button onClick={handleLoginClick} className="text-yellow-500 hover:underline">Login</button></p>
          
        </div>      
      </div>
    </div>
  )
}
