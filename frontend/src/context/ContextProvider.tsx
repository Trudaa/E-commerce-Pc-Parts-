import React, { useState,createContext, useContext } from "react"
import axiosApi from "../axiosApi"

type UserType = {
    user:User | null,
    token:string | null,
    setUser:(user:null)=>void,
    setUserValue:(user: string|null)=>void,
    setTokenValue:(token: string|null)=>void    
    getCartCount:()=>void
    setCartCount:(cartCount:number)=>void
    cartCount:number
}

type User = {
    name:string
    id:number
}

const StateContext = createContext <UserType>({
    user:null,
    token: null,
    setUser:()=>{},
    setUserValue:()=>{},
    setTokenValue:()=>{},     
    getCartCount:()=>{},
    setCartCount:()=>{},
    cartCount:0
})

export const ContextProvider = ({children}:{children:React.ReactNode}) => {

    const [user,setUser] = useState<User|null>(JSON.parse(localStorage.getItem('user') ||'null'))
    const [token,setToken] = useState<string | null>(localStorage.getItem('token'))
    const [cartCount, setCartCount] = useState(0)

    const setTokenValue = (token:string | null) =>{
        setToken(token)
            if (token) {
                localStorage.setItem('token', token)
              } else {
                localStorage.removeItem('token')
              }
        }
    
    const setUserValue = (user:any | null) =>{
        setToken(user)
            if (user) {
                localStorage.setItem('user', JSON.stringify(user))
              } else {
                localStorage.removeItem('user')
              }
        }

    const getCartCount = () => {
        axiosApi.get(`/carts/${user?.id}`)
        .then((response) => {
        setCartCount(response.data.cartCount)
        })
        .catch((error) => {
         console.log(error)
        })
        }
        
    

  return (
      <StateContext.Provider value={{user, token, setUser, setTokenValue, setUserValue,getCartCount,cartCount,setCartCount}}>
          {children}
      </StateContext.Provider>
  )
}
 
 export const useStateContext =() => useContext(StateContext)
