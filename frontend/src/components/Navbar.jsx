// import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
// import logo from "../assets/logo.svg";
// import { useSelector, useDispatch } from "react-redux";
// import { useState, useEffect, useRef } from "react";
// import { FiEdit, FiUser, FiSettings, FiLogOut } from "react-icons/fi";
// import { logout } from "../utils/userSlice"; // adjust path if needed

// function Navbar() {
//   const { token, name } = useSelector((state) => state.user);
//   const dispatch = useDispatch();
//   const [searchQuery, setSearchQuery] = useState("");
//   const [openDropdown, setOpenDropdown] = useState(false);
//   const navigate = useNavigate();
//   const location = useLocation();
//   const dropdownRef = useRef();

//   // Clear search when leaving search page
//   useEffect(() => {
//     if (!location.pathname.includes("/search")) {
//       setSearchQuery("");
//     }
//   }, [location.pathname]);

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     function handleClickOutside(e) {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
//         setOpenDropdown(false);
//       }
//     }
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const handleLogout = () => {
//     dispatch(logout());
//     navigate("/signin");
//   };

//   return (
//     <>
//       <div className="bg-white w-full flex justify-between items-center px-4 sm:px-6 md:px-10 h-[65px] border-b shadow-sm">
//         {/* LEFT SECTION */}
//         <div className="flex items-center gap-3 sm:gap-5 w-full md:w-auto">
//           <Link to="/">
//             <img src={logo} alt="Logo" className="w-8 sm:w-10" />
//           </Link>

//           {/* SEARCH (hidden on very small screens) */}
//           <input
//             type="text"
//             className="hidden sm:block bg-gray-100 focus:outline-none rounded-full px-4 py-2 text-sm md:text-base w-full md:w-[250px]"
//             placeholder="Search"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             onKeyDown={(e) => {
//               if (e.key === "Enter" && searchQuery.trim()) {
//                 navigate(`/search?q=${searchQuery.trim()}`);
//               }
//             }}
//           />
//         </div>

//         {/* RIGHT SECTION */}
//         <div className="flex items-center gap-3 sm:gap-5">
//           {/* WRITE BUTTON (hide text on mobile) */}
//           <Link to="/add-blog">
//             <div className="flex items-center gap-1 sm:gap-2 text-gray-600 hover:text-black cursor-pointer">
//               <FiEdit className="text-lg sm:text-xl" />
//               <span className="hidden sm:block text-base">Write</span>
//             </div>
//           </Link>

//           {/* AUTH SECTION */}
//           {token ? (
//             <div className="relative" ref={dropdownRef}>
//               {/* Profile Circle */}
//               <div
//                 onClick={() => setOpenDropdown(!openDropdown)}
//                 className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-blue-500 text-white flex items-center justify-center cursor-pointer font-bold uppercase text-sm sm:text-base"
//               >
//                 {name?.charAt(0)}
//               </div>

//               {/* Dropdown */}
//               {openDropdown && (
//                 <div className="absolute right-0 mt-3 w-44 sm:w-48 bg-white border rounded-md shadow-lg py-2 z-50">
//                   <Link
//                     className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
//                     to="/profile"
//                   >
//                     <FiUser /> Profile
//                   </Link>

//                   <Link
//                     className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
//                     to="/edit-profile"
//                   >
//                     <FiEdit /> Edit
//                   </Link>

//                   <Link
//                     className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
//                     to="/settings"
//                   >
//                     <FiSettings /> Settings
//                   </Link>

//                   <button
//                     onClick={handleLogout}
//                     className="w-full text-left flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-red-500"
//                   >
//                     <FiLogOut /> Logout
//                   </button>
//                 </div>
//               )}
//             </div>
//           ) : (
//             <div className="flex gap-2 sm:gap-3">
//               <Link to="/signup">
//                 <button className="bg-blue-500 px-3 sm:px-5 py-1.5 sm:py-2 text-white rounded-full text-sm sm:text-base">
//                   Signup
//                 </button>
//               </Link>
//               <Link to="/signin">
//                 <button className="border px-3 sm:px-5 py-1.5 sm:py-2 rounded-full text-sm sm:text-base">
//                   Signin
//                 </button>
//               </Link>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* MOBILE SEARCH BAR */}
//       <div className="sm:hidden px-4 py-2 border-b">
//         <input
//           type="text"
//           className="w-full bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none"
//           placeholder="Search"
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//           onKeyDown={(e) => {
//             if (e.key === "Enter" && searchQuery.trim()) {
//               navigate(`/search?q=${searchQuery.trim()}`);
//             }
//           }}
//         />
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
import {
  FiEdit,
  FiUser,
  FiSettings,
  FiLogOut,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { logout } from "../utils/userSlice";

function Navbar() {
  const { token, name } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [searchQuery, setSearchQuery] = useState("");
  const [openDropdown, setOpenDropdown] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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

  // Close mobile menu when screen becomes large
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/signin");
  };

  return (
    <>
      {/* NAVBAR */}
      <div className="bg-white w-full flex justify-between items-center px-4 sm:px-6 md:px-10 h-[65px] border-b shadow-sm">
        {/* LEFT */}
        <div className="flex items-center gap-3 sm:gap-5 w-full md:w-auto">
          <Link to="/">
            <img src={logo} alt="Logo" className="w-8 sm:w-10" />
          </Link>

          {/* SEARCH (Desktop only) */}
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && searchQuery.trim()) {
                navigate(`/search?q=${searchQuery.trim()}`);
              }
            }}
            className="hidden md:block bg-gray-100 px-4 py-2 rounded-full text-sm w-[250px] focus:outline-none"
          />
        </div>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-5">
          <Link to="/add-blog" className="flex items-center gap-2">
            <FiEdit />
            <span>Write</span>
          </Link>

          {token ? (
            <div className="relative" ref={dropdownRef}>
              {/* PROFILE */}
              <div
                onClick={() => setOpenDropdown(!openDropdown)}
                className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center cursor-pointer font-bold uppercase"
              >
                {name?.charAt(0)}
              </div>

              {/* DROPDOWN */}
              {openDropdown && (
                <div className="absolute right-0 mt-3 w-48 bg-white border rounded-md shadow-lg py-2 z-50">
                  <Link
                    to="/profile"
                    className="flex gap-2 px-4 py-2 hover:bg-gray-100"
                  >
                    <FiUser /> Profile
                  </Link>

                  <Link
                    to="/settings"
                    className="flex gap-2 px-4 py-2 hover:bg-gray-100"
                  >
                    <FiSettings /> Settings
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left flex gap-2 px-4 py-2 hover:bg-gray-100 text-red-500"
                  >
                    <FiLogOut /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex gap-3">
              <Link to="/signup">
                <button className="bg-blue-500 px-5 py-2 text-white rounded-full">
                  Signup
                </button>
              </Link>

              <Link to="/signin">
                <button className="border px-5 py-2 rounded-full">
                  Signin
                </button>
              </Link>
            </div>
          )}
        </div>

        {/* HAMBURGER (ONLY MOBILE) */}
        <div className="block md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* MOBILE SEARCH */}
      <div className="md:hidden px-4 py-2 border-b">
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && searchQuery.trim()) {
              navigate(`/search?q=${searchQuery.trim()}`);
            }
          }}
          className="w-full bg-gray-100 px-4 py-2 rounded-full text-sm focus:outline-none"
        />
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="md:hidden bg-white border-b shadow-md px-4 py-4 flex flex-col gap-4">
          <Link to="/add-blog" onClick={() => setMenuOpen(false)}>
            Write Blog
          </Link>

          {token ? (
            <>
              <Link to="/profile" onClick={() => setMenuOpen(false)}>
                Profile
              </Link>

              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="text-red-500 text-left"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/signup" onClick={() => setMenuOpen(false)}>
                <button className="w-full bg-blue-500 py-2 text-white rounded-full">
                  Signup
                </button>
              </Link>

              <Link to="/signin" onClick={() => setMenuOpen(false)}>
                <button className="w-full border py-2 rounded-full">
                  Signin
                </button>
              </Link>
            </>
          )}
        </div>
      )}

      <Outlet />
    </>
  );
}

export default Navbar;
