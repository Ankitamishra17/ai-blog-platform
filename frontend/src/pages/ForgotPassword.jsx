import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

function ForgotPassword() {
  const [email, setEmail] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/forgot-password`,
        { email },
      );

      toast.success(res.data.message);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }

  return (
    <div className="flex justify-center mt-20">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-100 p-6 rounded-xl flex flex-col gap-4 w-[300px]"
      >
        <h1 className="text-xl font-semibold">Forgot Password</h1>

        <input
          type="email"
          placeholder="Enter your email"
          className="p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button className="bg-blue-500 text-white p-2 rounded">
          Send Reset Link
        </button>
      </form>
    </div>
  );
}

export default ForgotPassword;
