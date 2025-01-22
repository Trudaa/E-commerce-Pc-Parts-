import { useState } from "react"
import axiosApi from "../axiosApi"
import { useStateContext } from "../context/ContextProvider"
import Swal from "sweetalert2"

type LoginProps = {
  handleLoginClick: () => void
  handleModalClick: () => void
}

export const Login = ({handleLoginClick,handleModalClick}:LoginProps) => {

  const {setUserValue} = useStateContext()
  const [loginDetails, setLoginDetails] = useState({
    email: '',
    password: ''
  })
 
  console.log(loginDetails)
  const handleLogin = (e:any) =>{  
    e.preventDefault()
    axiosApi.post('/login', loginDetails)
    .then((response) =>{
      window.location.reload()
      localStorage.setItem('token', response.data.token)
      setUserValue(response.data.user)
    })
    .catch((error)=>{
      Swal.fire({
        title: "Login Failed",
        text: error.response?.data?.message || "Something went wrong. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
    })
  })
}
   
  const handleChange =(e:any) =>{
    setLoginDetails({
      ...loginDetails,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-96 bg-white shadow-lg rounded-lg p-6 relative">
        <button
          onClick={()=>{handleModalClick(); handleLoginClick()}}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">Login</h2>
        <p className="text-center text-gray-500 mb-6">Welcome back! Sign in to your account</p>

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value = {loginDetails.email}
              onChange={handleChange}
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
              value = {loginDetails.password}
              onChange={handleChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-md"
          >
            Login
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-500">New customer? <button onClick={handleLoginClick} className="text-yellow-500 hover:underline" >Create your account</button></p>      
        </div>      
      </div>
    </div>
  )
}
