import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";

// 🔥 Lazy Imports
const AuthForm = lazy(() => import("./pages/AuthForm"));
const Navbar = lazy(() => import("./components/Navbar"));
const HomePage = lazy(() => import("./components/HomePage"));
const AddBlog = lazy(() => import("./pages/AddBlog"));
const BlogPage = lazy(() => import("./pages/BlogPage"));
const SearchBlogs = lazy(() => import("./pages/SearchBlogs"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"))

function App() {
  return (
    <Suspense fallback={<div className="text-center mt-10">Loading...</div>}>
      <Routes>
        <Route path="/" element={<Navbar />}>
          <Route index element={<HomePage />} />
          <Route path="signin" element={<AuthForm type={"signin"} />} />
          <Route path="signup" element={<AuthForm type={"signup"} />} />
          <Route path="add-blog" element={<AddBlog />} />
          <Route path="blog/:id" element={<BlogPage />} />
          <Route path="edit/:id" element={<AddBlog />} />
          <Route path="search" element={<SearchBlogs />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
