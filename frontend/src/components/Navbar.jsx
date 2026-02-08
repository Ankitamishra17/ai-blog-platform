// import { Outlet } from "react-router-dom";
// import logo from "../assets/logo.svg";
// import { Link } from "react-router-dom";
// import { useSelector } from "react-redux";
// import { useState, useEffect } from "react";
// import axios from "axios";

// function Navbar() {
//   const { token, name } = useSelector((state) => state.user);

//   const [searchQuery, setSearchQuery] = useState(null);
//   //console.log(searchQuery);

//   useEffect(() => {
//     if (searchQuery) {
//       async function fetchSearchBlogs() {
//         try {
//           let res = await axios.get(
//             `http://localhost:3000/api/v1/search-blog?search=${searchQuery}`,
//           );

//           // let res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/blogs`)
//           console.log(res.data);
//         } catch (error) {
//           console.log(error);
//         }
//       }
//       setTimeout(() => {
//         fetchSearchBlogs();
//       }, 2000);
//     }
//   }, [searchQuery]);

//   return (
//     <>
//       <div
//         className="bg-white max-w-full flex justify-between h-[70px] item-center px-[30px]
//                border-b drop-shadow-md"
//       >
//         <div className="flex gap-4  items-center">
//           <Link to={"/"}>
//             <div>
//               <img src={logo} alt="Logo" />
//             </div>
//           </Link>
//           <div className="relative">
//             <i
//               className="fi fi-rr-search absolute text-lg top-1/2
//                         -translate-y-1/2 ml-4 opacity-40 "
//             ></i>
//             <input
//               type="text"
//               className="bg-gray-100 focus:outline-none rounded-full pl-12 p-2"
//               placeholder="Search"
//               value={searchQuery ? searchQuery : ""}
//               onChange={(e) => {
//                 setSearchQuery(e.target.value);
//                 //console.log(e.target.value);
//               }}
//             />
//           </div>
//         </div>

//         <div className="flex gap-5 justify-center items-center">
//           <Link to={"/add-blog"}>
//             <div className="flex gap-2 item-center">
//               <i className="fi fi-rr-edit text-2xl mt-1"></i>
//               <span className="text-xl">write</span>
//             </div>
//           </Link>

//           {token ? (
//             <div className="text-xl capitalize mb-2">{name}</div>
//           ) : (
//             <div className="flex gap-2">
//               <Link to={"/signup"}>
//                 <button
//                   className="bg-blue-500 px-6 py-3 text-white
//                         rounded-full"
//                 >
//                   Signup
//                 </button>
//               </Link>
//               <Link to={"/signin"}>
//                 <button
//                   className="border px-6 py-3
//                         rounded-full"
//                 >
//                   Signin
//                 </button>
//               </Link>
//             </div>
//           )}
//         </div>
//       </div>
//       <Outlet />
//     </>
//   );
// }

// export default Navbar;

import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/logo.svg";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect, useRef } from "react";
import { FiEdit, FiUser, FiSettings, FiLogOut } from "react-icons/fi";
import { logout } from "../utils/userSlice"; // adjust path if needed

function Navbar() {
  const { token, name } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [openDropdown, setOpenDropdown] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef();

  // Clear search when leaving search page
  useEffect(() => {
    if (!location.pathname.includes("/search")) {
      setSearchQuery("");
    }
  }, [location.pathname]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/signin");
  };

  return (
    <>
      <div className="bg-white max-w-full flex justify-between h-[70px] items-center px-[30px] border-b drop-shadow-md">
        {/* LEFT SECTION */}
        <div className="flex gap-4 items-center">
          <Link to="/">
            <img src={logo} alt="Logo" />
          </Link>

          <input
            type="text"
            className="bg-gray-100 focus:outline-none rounded-full px-4 py-2"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && searchQuery.trim()) {
                navigate(`/search?q=${searchQuery.trim()}`);
              }
            }}
          />
        </div>

        {/* RIGHT SECTION */}
        <div className="flex gap-6 items-center">
          <Link to="/add-blog">
            <div className="flex items-center gap-2 text-gray-600 hover:text-black transition cursor-pointer">
              <FiEdit className="text-xl" />
              <span className="text-xl">Write</span>
            </div>
          </Link>

          {token ? (
            <div className="relative" ref={dropdownRef}>
              {/* Profile Circle */}
              <div
                onClick={() => setOpenDropdown(!openDropdown)}
                className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center cursor-pointer font-bold uppercase"
              >
                {name?.charAt(0)}
              </div>

              {/* Dropdown */}
              {openDropdown && (
                <div className="absolute right-0 mt-3 w-48 bg-white border rounded-md shadow-lg py-2 z-50">
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                  >
                    <FiUser /> View Profile
                  </Link>

                  <Link
                    to="/edit-profile"
                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                  >
                    <FiEdit /> Edit Profile
                  </Link>

                  <Link
                    to="/settings"
                    className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                  >
                    <FiSettings /> Settings
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-red-500"
                  >
                    <FiLogOut /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex gap-3">
              <Link to="/signup">
                <button className="bg-blue-500 px-5 py-2 text-white rounded-full hover:bg-blue-600 transition">
                  Signup
                </button>
              </Link>
              <Link to="/signin">
                <button className="border px-5 py-2 rounded-full hover:bg-gray-100 transition">
                  Signin
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>

      <Outlet />
    </>
  );
}

export default Navbar;
