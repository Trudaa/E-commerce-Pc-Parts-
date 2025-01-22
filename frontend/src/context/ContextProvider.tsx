import React, { useState,createContext, useContext } from "react"

type UserType = {
    user:any | null,
    token:string | null,
    setUser:(user:null)=>void,
    setUserValue:(user: string|null)=>void,
    setTokenValue:(token: string|null)=>void    
}

const StateContext = createContext <UserType>({
    user:null,
    token: null,
    setUser:()=>{},
    setUserValue:()=>{},
    setTokenValue:()=>{},     
})

export const ContextProvider = ({children}:{children:React.ReactNode}) => {

    const [user,setUser] = useState<any | null>(JSON.parse(localStorage.getItem('user') ||'null'))
    const [token,setToken] = useState<string | null>(localStorage.getItem('token'))
   

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

  return (
      <StateContext.Provider value={{user, token, setUser, setTokenValue, setUserValue}}>
          {children}
      </StateContext.Provider>
  )
}
 
 export const useStateContext =() => useContext(StateContext)
