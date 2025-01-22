import { Link, useNavigate, Outlet } from "react-router-dom";
import { Login } from "./Login";
import { useState } from "react";
import { Signup } from "./Signup";
import { useStateContext } from "../context/ContextProvider";

export const HomePage = () => {
  
  const navigate = useNavigate();

  const {user,setUserValue,setTokenValue} = useStateContext()
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [search, setSearch] = useState<string | null>(null);
  const [triggerSearch,setTriggerSearch] = useState<boolean>(false)

  const handleLoginClick = () => {
    setIsLoginOpen(!isLoginOpen)
  }
  const handleModalClick = () => {
    setIsModalOpen(!isModalOpen)
   }
  
   const handleSearchSubmit = (e:any) => {
    e.preventDefault()
    setSearch(search?? '')
    setTriggerSearch(!triggerSearch)
    console.log("trigger(homepage)",triggerSearch)
    navigate("/components")
  }

  return (
<div className="flex flex-col min-h-screen">
  <header className="bg-blue-500 text-white fixed w-full">
    <div className="container mx-auto px-4 py-4 flex items-center justify-between">
      {/* Logo */}
      <Link to="/" className="text-xl font-bold flex-shrink-0 ml-4">
        TRUDA's PC
      </Link>

      {/* Search Bar */}
      <div className="flex-1 mx-4 relative max-w-lg">
        <div className="flex justify-center">
          <input
            type="text"
            placeholder="Search"
            value={search ?? ''}
            className="w-full px-3 py-1 rounded-full border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-700 text-black"
            onChange={(e) => {setSearch(e.target.value)}}
          />
         
          <button onClick={handleSearchSubmit} className="absolute right-3 top-1">
            🔍
          </button>
        </div>
      </div>
      {/* User Options */}
      <div className="flex items-center space-x-3 mr-4">
        <div className="cursor-pointer">
         <Link to="/cart" >🛒</Link>
        </div>
        <div className="cursor-pointer py-1 px-1 rounded-full text-white font-semibold focus:outline-none focus:ring-2">
        <span> 👤 </span>
          {user == null ? (
            <a
              onClick={() => {
                handleModalClick();
                handleLoginClick();
              }}
             
            >
             Login / Sign In
            </a>
          ) : (
            <button
              onClick={() => {
                setUserValue(null);
                window.location.reload();
                setTokenValue(null);
              }}
            >
              {user.name}
            </button>
          )}
         </div>
       
      </div>
    </div>

    <nav className="bg-white text-blue-500 shadow-md mt-1">
      <div className="container mx-auto px-4 py-1 flex justify-center items-center space-x-4">
        <Link className="hover:underline" to="/">
          HOME
        </Link>
        <Link className="hover:underline" to="/components">
          PRODUCTS
        </Link>
        <Link className="hover:underline" to="/desktop">
          DESKTOP
        </Link>
        <Link className="hover:underline" to="/laptop">
          LAPTOP
        </Link>
      </div>
    </nav>
  </header>

  <main className="flex-grow pt-32 flex justify-center mx-auto w-full max-w-screen-2xl">
  <div className="w-full px-4">
    <Outlet context={{handleSearchSubmit,search,triggerSearch}}/>
  </div>
  </main>

  {isModalOpen && isLoginOpen && (
    <Login handleLoginClick={handleLoginClick} handleModalClick={handleModalClick} />
  )}
  {isModalOpen && !isLoginOpen && (
    <Signup handleLoginClick={handleLoginClick} handleModalClick={handleModalClick} />
  )}

  <footer>
    <div className="bg-gray-800 text-white py-3">
      <div className="container mx-auto text-center">
        <p>&copy; 2023 TRUDA's PC. All rights reserved.</p>
      </div>
    </div>
  </footer>
</div>

  
  )
}
