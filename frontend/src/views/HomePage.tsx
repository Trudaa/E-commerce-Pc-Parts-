import { Link, useNavigate, Outlet } from "react-router-dom";
import { Login } from "./Login";
import { useEffect, useState } from "react";
import { Signup } from "./Signup";
import { useStateContext } from "../context/ContextProvider";
import axiosApi from "../axiosApi";
import Swal from "sweetalert2";

export const HomePage = () => {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();

  const { user, getCartCount, cartCount } = useStateContext();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [search, setSearch] = useState<string | null>(null);
  const [triggerSearch, setTriggerSearch] = useState<boolean>(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isComponentDropdownOpen, setIsComponentDropdownOpen] = useState(false);
  const [category, setCategory] = useState<string | null>(null);

  const handleLoginClick = () => {
    setIsLoginOpen(!isLoginOpen);
  };
  const handleModalClick = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleSearchSubmit = (e: any) => {
    e.preventDefault();
    setSearch(search ?? "");
    setTriggerSearch(!triggerSearch);

    navigate("/components");
  };

  const handleLogout = () => {
    axiosApi
      .post("/logout")
      .then((response) => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        Swal.fire({
          title: "Account Logout",
          text: "Account Logout successfully.",
          icon: "success",
          confirmButtonText: "OK",
        });
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleCartClick = () => {
    if (!user) {
      setIsModalOpen(!isModalOpen);
      setIsLoginOpen(!isLoginOpen);
      return;
    }
    navigate("/cart");
  };

  const handleCategoryClick = (category: string | null) => {
    setCategory(category);
    setIsComponentDropdownOpen(false);
  };

  useEffect(() => {
    if (user) getCartCount();
  }, [user]);

  console.log("category", category);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="fixed w-full text-white bg-blue-500">
        <div className="container flex items-center justify-between px-4 py-4 mx-auto">
          {/* Logo */}
          <Link
            to="/"
            className="flex-shrink-0 ml-4 text-xl font-bold"
          >
            TRUDA's PC
          </Link>
          {/* Search Bar */}
          <div className="relative flex-1 max-w-lg mx-4">
            <div className="flex justify-center">
              <input
                type="text"
                placeholder="Search"
                value={search ?? ""}
                className="w-full px-3 py-1 text-black border border-blue-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-700"
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
              />
              <button
                onClick={handleSearchSubmit}
                className="absolute right-3 top-1"
              >
                🔍
              </button>
            </div>
          </div>
          {/* User Options */}
          <div className="flex items-center mr-4 space-x-3">
            <div className="relative cursor-pointer">
              <button onClick={handleCartClick}>🛒</button>
              <span className="absolute px-1 text-xs text-white bg-red-500 rounded-full -top-1 -right-1">
                {cartCount}
              </span>
            </div>
            <div className="relative">
              <div
                className="flex items-center px-2 py-1 font-semibold text-white rounded-full cursor-pointer focus:outline-none focus:ring-2"
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
                <div className="absolute right-0 z-50 mt-2 bg-white border border-gray-300 rounded-md shadow-lg">
                  <ul className="py-1 text-gray-800">
                    <li>
                      <Link
                        to={`/${user.name}/settings`}
                        className="px-4 py-2 hover:bg-gray-200"
                      >
                        Settings
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={handleLogout}
                        className="px-4 py-2 hover:bg-gray-200"
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

        <nav className="mt-1 text-blue-500 bg-white shadow-md">
          <div className="container flex items-center justify-center px-4 py-1 mx-auto space-x-4">
            <Link
              className="hover:underline"
              to="/"
            >
              HOME
            </Link>
            <div className="relative">
              <div
                className="flex items-center px-2 py-1 rounded-full cursor-pointer focus:outline-none focus:ring-2"
                onClick={() =>
                  setIsComponentDropdownOpen(!isComponentDropdownOpen)
                }
              >
                PRODUCTS
              </div>
              {isComponentDropdownOpen && (
                <div className="absolute right-0 z-50 mt-2 bg-white border border-gray-300 rounded-md shadow-lg">
                  <ul className="py-1 text-gray-800">
                    <li>
                      <Link
                        to="/components"
                        className="px-4 py-2 text-lg font-bold "
                      >
                        <button onClick={() => handleCategoryClick(null)}>
                          Components
                        </button>
                      </Link>
                    </li>
                    <li className="flex flex-col px-4 py-2 ">
                      <button
                        className="px-4 py-2 hover:bg-gray-200"
                        onClick={() => handleCategoryClick("motherboard")}
                      >
                        <Link to="/components">Motherboard</Link>
                      </button>
                      <div
                        className="px-4 py-2 hover:bg-gray-200"
                        onClick={() => handleCategoryClick("processor")}
                      >
                        <Link to="/components">Processor</Link>
                      </div>
                      <div
                        className="px-4 py-2 hover:bg-gray-200"
                        onClick={() => handleCategoryClick("videocard")}
                      >
                        <Link to="/components">Videocard</Link>
                      </div>
                      <div
                        className="px-4 py-2 hover:bg-gray-200"
                        onClick={() => handleCategoryClick("storage")}
                      >
                        <Link to="/components">Storage</Link>
                      </div>
                    </li>
                  </ul>
                </div>
              )}
            </div>
            <Link
              className="hover:underline"
              to="/desktop"
            >
              DESKTOP
            </Link>
            <Link
              className="hover:underline"
              to="/laptop"
            >
              LAPTOP
            </Link>
          </div>
        </nav>
      </header>

      <main className="flex justify-center flex-grow w-full pt-32 mx-auto max-w-screen-2xl">
        <div className="w-full px-4">
          <Outlet
            context={{ handleSearchSubmit, search, triggerSearch, category }}
          />
        </div>
      </main>

      {isModalOpen && isLoginOpen && (
        <Login
          handleLoginClick={handleLoginClick}
          handleModalClick={handleModalClick}
        />
      )}
      {isModalOpen && !isLoginOpen && (
        <Signup
          handleLoginClick={handleLoginClick}
          handleModalClick={handleModalClick}
        />
      )}

      <footer>
        <div className="py-3 text-white bg-gray-800">
          <div className="container mx-auto text-center">
            <p> Copyright {currentYear} | TRUDA's PC. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
