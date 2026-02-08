import { createSlice } from "@reduxjs/toolkit";



// import { createSlice } from "@reduxjs/toolkit";

// let initialState = { token: null };

// try {
//   const storedUser = localStorage.getItem("user");
//   if (storedUser) {
//     const parsed = JSON.parse(storedUser);
//     if (parsed && typeof parsed === 'object' && 'token' in parsed) {
//       initialState = parsed;
//     }
//   }
// } catch (error) {
//   console.warn("Failed to parse user from localStorage:", error);
// }

// const userSlice = createSlice({
//   name: "userSlice",
//   initialState,
//   reducers: {
//     login(state, action) {
//       localStorage.setItem("user", JSON.stringify(action.payload));
//       return action.payload;
//     },
//     logout(state, action) {
//       localStorage.removeItem("user");
//       return { token: null };
//     },
//   },
// });

// export const { login, logout } = userSlice.actions;
// export default userSlice.reducer;


// Safely get user from localStorage
const userFromStorage = localStorage.getItem("user");

let initialState = { token: null };

if (userFromStorage && userFromStorage !== "undefined") {
  try {
    initialState = JSON.parse(userFromStorage);
  } catch (error) {
    console.error("Invalid user data in localStorage", error);
    localStorage.removeItem("user");
  }
}

const userSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {
    login(state, action) {
      localStorage.setItem("user", JSON.stringify(action.payload));
      return action.payload;
    },

    logout() {
      localStorage.removeItem("user");
      return { token: null };
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;