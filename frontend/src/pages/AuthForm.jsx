import { useState } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../utils/userSlice";
import Input from "../components/Input";
import googleIcon from "../assets/google_icon.svg";
import { googleAuth } from "../utils/firebase";

function AuthForm({ type }) {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const dispatch = useDispatch(); //it is hook use in redux
  const navigate = useNavigate();

  async function handleGoogleAuth() {
    try {
      let data = await googleAuth();
      //console.log(data);
      const res = await axios.post(`http://localhost:3000/api/v1/google-auth`, {
        accessToken: data.accessToken,
      });
      console.log(res);
      dispatch(login(res.data.user));
      toast.success(res.data.message);
      navigate("/");
    } catch (error) {
      console.log(error);
      //toast.error(error.message.data.message)
      toast.error(error?.response?.data?.message || "Google Auth failed");
    }
  }

  async function handleAuthForm(e) {
    e.preventDefault();
    console.log(userData); // See if captured
    //alert("hello")

    try {
      //    const data = await fetch(`http://localhost:3000/api/v1/${type}` , {
      //   method:"POST",
      //   body: JSON.stringify(userData),
      //   headers: {
      //     "Content-Type" : "application/json"
      //   },
      // });
      // const res = await data.json();

      const res = await axios.post(
        `http://localhost:3000/api/v1/${type}`,
        userData,
      );
      //console.log(res.status);
      //console.log(res);

      dispatch(login(res.data.user));

      // if(!res.success){
      //     toast.error("who are you")
      // }

      // localStorage.setItem("user" , JSON.stringify(res.data.user));
      // localStorage.setItem("token" , JSON.stringify(res.data.token));
      toast.success(res.data.message);
      navigate("/");
    } catch (error) {
      //toast.error(error.response.data.message)
      //console.log(error.response.data.message);
      const errorMessage =
        error?.response?.data?.message || "Something went wrong";
      toast.error(errorMessage);
      console.error("Auth error:", error);
    } finally {
      setUserData({
        name: "",
        email: "",
        password: "",
      });
    }
  }

  return (
    <div className="w-full">
      <div className=" bg-gray-100 mx-auto p-4 rounded-xl max-w-[350px] flex flex-col  items-center gap-5 mt-52">
        <h1 className="text-3xl">
          {type === "signin" ? "Sign in" : "Sign up"}
        </h1>
        <form
          action=""
          className="w-[100%] flex flex-col  items-center gap-5"
          onSubmit={handleAuthForm}
        >
          {type == "signup" && (
            <Input
              type={"text"}
              placeholder={"Enter your name"}
              setUserData={setUserData}
              field={"name"}
              value={userData.name}
              icon={"fi-rr-user"}
            />
          )}

          <Input
            type={"email"}
            placeholder={"Enter your email"}
            setUserData={setUserData}
            field={"email"}
            value={userData.email}
            icon={"fi-rr-at"}
          />

          <Input
            type={"password"}
            placeholder={"Enter your password"}
            setUserData={setUserData}
            field={"password"}
            value={userData.password}
            icon={"fi-rr-lock"}
          />

          <button
            type="submit"
            className="w-[100px] h-[50px] bg-blue-500  text-white text-xl p-2 rounded-md focus:outline-none"
          >
            {type == "signin" ? "Login" : " register"}
          </button>
        </form>
        <p className="text-xl font-semibold">or</p>

        <div
          onClick={handleGoogleAuth}
          className="bg-white w-full py-2 px-4  border hover:bg-gray-200 flex gap-2  item-center justify-center overflow-hidden rounded-full cursor-pointer"
        >
          <p className="text-1xl font-medium ">continue with</p>
          <div className="">
            <img className="w-8 h-8" src={googleIcon} alt="" />
          </div>
        </div>
        {type == "signin" ? (
          <p>
            Don't have an account <Link to={"/signup"}> Sign up</Link>{" "}
          </p>
        ) : (
          <p>
            Already have an account <Link to={"/signin"}> Sign in</Link>
          </p>
        )}
      </div>
    </div>
  );
}

export default AuthForm;
