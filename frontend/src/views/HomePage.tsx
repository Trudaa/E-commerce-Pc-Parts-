import { Link, useNavigate, Outlet } from "react-router-dom";
import { Login } from "./Login";
import { useEffect, useState } from "react";
import { Signup } from "./Signup";
import { useStateContext } from "../context/ContextProvider";
import axiosApi from "../axiosApi";
import Swal from "sweetalert2";



export const HomePage = () => {
  
  const navigate = useNavigate();

  const {user,getCartCount,cartCount} = useStateContext()
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [search, setSearch] = useState<string | null>(null);
  const [triggerSearch,setTriggerSearch] = useState<boolean>(false)
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isComponentDropdownOpen, setIsComponentDropdownOpen] = useState(false);
  const [category, setCategory] = useState<string | null>(null);
 
 

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
    
    navigate("/components")
  }

  

  const handleLogout = () => {
   axiosApi.post('/logout')
    .then((response) => {
     localStorage.removeItem('token')
     localStorage.removeItem('user')
     Swal.fire({
               title: "Account Logout",
               text:  "Account Logout successfully.",
               icon: "success",
               confirmButtonText: "OK",
           })
     setTimeout(() => {
       window.location.reload()
     },1000)   
   })
    .catch((error) => {
      console.log(error)
    })
  }

  const handleCartClick = () =>{ 
    if(!user){
      setIsModalOpen(!isModalOpen)
      setIsLoginOpen(!isLoginOpen)
      return 
    }
     navigate('/cart')
  }

  const handleCategoryClick = (category: string | null) => {
    setCategory(category)
    setIsComponentDropdownOpen(false)
  };

  useEffect(() => {
    if (user) getCartCount();
  }, [user]);

  console.log("category",category)

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
        <div className="cursor-pointer relative">
          <button onClick={handleCartClick}>🛒</button>
          <span className="absolute -top-1 -right-1 text-xs text-white bg-red-500 rounded-full px-1">{cartCount}</span>
        </div>
        <div className="relative">
          <div
            className="cursor-pointer py-1 px-2 rounded-full text-white font-semibold focus:outline-none focus:ring-2 flex items-center"
            onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
          >
            <span>👤</span>
            {user == null ? (
              <a
                onClick={() => {
                  handleModalClick();
                  handleLoginClick();
                }}
                className="ml-2"
              >
                Login / Sign In
              </a>
            ) : (
              <button className="ml-2">{user.name}</button>
            )}
          </div>
          {isUserDropdownOpen && user && (
            <div className="absolute right-0 mt-2  bg-white rounded-md shadow-lg border border-gray-300 z-50">
              <ul className="py-1 text-gray-800">
                <li>
                  <Link to={`/${user.name}/settings`} className=" px-4 py-2 hover:bg-gray-200">
                     Settings
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className=" px-4 py-2 hover:bg-gray-200"
                  >
                     Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
       
      </div>
    </div>

    <nav className="bg-white text-blue-500 shadow-md mt-1">
      <div className="container mx-auto px-4 py-1 flex justify-center items-center space-x-4">
        <Link className="hover:underline" to="/">
          HOME
        </Link>
        <div className="relative">
          <div
            className="cursor-pointer py-1 px-2 rounded-full  focus:outline-none focus:ring-2 flex items-center"
            onClick={() => setIsComponentDropdownOpen(!isComponentDropdownOpen)}
          >
          PRODUCTS
         </div>
        {isComponentDropdownOpen && (
            <div className="absolute right-0 mt-2  bg-white rounded-md shadow-lg border border-gray-300 z-50">
              <ul className="py-1 text-gray-800">
                <li>
                  <Link to="/components" className=" font-bold text-lg px-4 py-2 ">
                  <button
                   onClick={() => handleCategoryClick(null)}
                  >Components
                  </button>
                    
                  </Link>
                </li>
                <li className="flex flex-col px-4 py-2 ">
                  <button
                    className=" px-4 py-2 hover:bg-gray-200"
                    onClick={() => handleCategoryClick("motherboard")}
                  >
                    <Link to="/components">Motherboard</Link>
                  </button>
                  <div
                    className=" px-4 py-2 hover:bg-gray-200"
                    onClick={() => handleCategoryClick("processor")}
                  >
                     <Link to="/components">Processor</Link>
                  </div>
                  <div
                    className=" px-4 py-2 hover:bg-gray-200"
                    onClick={() => handleCategoryClick("videocard")}
                  >
                    <Link to="/components">Videocard</Link>
                  </div>
                  <div
                    className=" px-4 py-2 hover:bg-gray-200"
                    onClick={() => handleCategoryClick("storage")}
                  >
                     <Link to="/components">Storage</Link>
                  </div>
                </li>
              </ul>
            </div>
          )}
        </div>
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
    <Outlet context={{handleSearchSubmit,search,triggerSearch,category}}/>
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
