import React from "react";
import { useState } from "react";

function Signup() {
  const [userData, setuserData] = useState({
    name: "",
    email: "",
    password: "",
  });

  async function handleRegister(e) {
    e.preventDefault();
    console.log(userData); // See if captured
    alert("hello");

    try {
      const data = await fetch("http://localhost:3000/api/v1/signup", {
        method: "POST",
        body: JSON.stringify(userData),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const res = await data.json();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="w-[20%] flex flex-col  items-center gap-5">
      <h1 className="text-3xl">Sign up</h1>
      <form
        action=""
        className="w-[100%] flex flex-col  items-center gap-5"
        onSubmit={handleRegister}
      >
        <input
          type="text"
          className="w-full h-[50px] bg-gray-500  text-white text-xl p-2 rounded-md focus:outline-none"
          placeholder="enter your name"
          onChange={(e) =>
            setuserData((prev) => ({
              ...prev,
              name: e.target.value,
            }))
          }
        />
        <input
          type="email"
          className="w-full h-[50px] bg-gray-500  text-white text-xl p-2 rounded-md focus:outline-none"
          placeholder="enter your email"
          onChange={(e) =>
            setuserData((prev) => ({
              ...prev,
              email: e.target.value,
            }))
          }
        />
        <input
          type="password"
          className="w-full  bg-gray-500 h-[50px] text-white text-xl p-2 rounded-md focus:outline-none"
          placeholder="enter your password"
          onChange={(e) =>
            setuserData((prev) => ({
              ...prev,
              password: e.target.value,
            }))
          }
        />
        <button
          type="submit"
          className="w-[100px] h-[50px] bg-gray-500  text-white text-xl p-2 rounded-md focus:outline-none"
        >
          register
        </button>
      </form>
    </div>
  );
}

export default Signup;
