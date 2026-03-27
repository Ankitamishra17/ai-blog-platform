import React, { useEffect, useState } from "react";

import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  addSelectedBlog,
  changeLikes,
  removeSelectedBlog,
} from "../utils/selectBlogSlice";
import Comment from "../components/Comment";
import { setIsOpen } from "../utils/commentSlice";

function BlogPage() {
  const { id } = useParams();
  //console.log(id)
  //console.log("Params from useParams():", useParams());
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // const user = JSON.parse(localStorage.getItem("user"));

  const { token, email, id: userId } = useSelector((state) => state.user);
  const { likes, comments, content } = useSelector(
    (state) => state.selectedBlog,
  );
  const { isOpen } = useSelector((state) => state.comment);
  //console.log(token);

  const [blogData, setBlogData] = useState(null);

  const [islike, setIsLike] = useState(false);

  //const [likes , setLikes] = useState()//no

  // async function fetchBlogById() {
  //   try {
  //     let {
  //       data: { blog },
  //     } =
  //       //  await axios.get(`http://localhost:3000/api/v1/blogs/${id}`);
  //       await axios.get(
  //         `${import.meta.env.VITE_BACKEND_URL}/api/v1/blogs/${id}`,
  //       );

  //     setBlogData(blog);
  //     //setLikes(blog.likes.length);//no
  //     if (blog.likes.includes(userId)) {
  //       setIsLike((prev) => !prev);
  //     }

  //     dispatch(addSelectedBlog(blog));
  //     // console.log(res)
  //   } catch (error) {
  //     toast.error(
  //       error.response?.data?.message ||
  //         error.message ||
  //         "Something went wrong",
  //     );
  //   }
  // }
  async function fetchBlogById() {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/blogs/${id}`,
      );

      console.log("FULL RESPONSE:", res.data); // 🔥 DEBUG

      const blog = res.data.blog || res.data; // ✅ SAFE

      setBlogData(blog);

      if (blog.likes?.includes(userId)) {
        setIsLike(true);
      }

      dispatch(addSelectedBlog(blog));
    } catch (error) {
      console.log("ERROR:", error); // 🔥 VERY IMPORTANT

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong",
      );
    }
  }

  async function handleLike() {
    if (token) {
      setIsLike((prev) => !prev);

      let res =
        // await axios.post(
        //   `http://localhost:3000/api/v1/blogs/like/${blogData._id}`,
        await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/blogs/like/${blogData._id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
      dispatch(changeLikes(userId));
      //  if(res.data.isLiked){
      //     setLikes((prev) => prev+1)
      //  } else{
      //    setLikes((prev) => prev-1)
      //  }
      console.log(res);
      toast.success(res.data.message);
    } else {
      return toast.error("Please signin for like this blog");
    }
  }
  useEffect(() => {
    fetchBlogById();
    return () => {
      dispatch(setIsOpen(false));
      if (window.location.pathname !== `/edit/${id}`) {
        dispatch(removeSelectedBlog());
      }
    };
  }, [id]);

  async function handleDeleteBlog() {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this blog?",
      );

      if (!confirmDelete) return;

      console.log("Token:", token);
      console.log("Logged userId:", userId);
      console.log("Blog creator:", blogData.creator._id);
      console.log("Blog ID being sent:", blogData._id);

      const res = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/blogs/${blogData._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log("Token:", token);
      console.log("Blog ID:", blogData._id);
      toast.success(res.data.message);

      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  }

  return (
    // <div className="max-w-[700px] mx-auto">
    //   {blogData ? (
    //     <div>
    //       <h1 className="mt-10 font-bold text-6xl capitalize">
    //         {blogData.title}
    //       </h1>
    //       <h2 className="my-5 text-3xl">{blogData.creator.name}</h2>
    //       {/* <img src={blogData.image} alt="" /> */}
    //       <img
    //         src={blogData.image}
    //         alt=""
    //         className="w-full aspect-video object-cover"
    //       />
    //       {token && userId === blogData.creator._id && (
    //         <div className="flex gap-4 mt-5">
    //           <Link to={`/edit/${blogData.blogId}`}>
    //             <button className="bg-green-500 px-6 py-2 text-xl text-white">
    //               Edit
    //             </button>
    //           </Link>

    //           <button
    //             onClick={handleDeleteBlog}
    //             className="bg-red-500 px-6 py-2 text-xl text-white"
    //           >
    //             Delete
    //           </button>
    //         </div>
    //       )}
    //       <div className="flex gap-7 mt-4">
    //         <div className=" cursor-pointer flex gap-2" onClick={handleLike}>
    //           {islike ? (
    //             <i className=" fi fi-sr-thumbs-up  text-blue-600 text-3xl rounded mt-1"></i>
    //           ) : (
    //             <i className=" fi fi-br-social-network text-3xl mt-1"></i>
    //           )}
    //           <p className="text-2xl mt-1">{likes.length}</p>
    //         </div>

    //         <div className="flex gap-2">
    //           <i
    //             onClick={() => dispatch(setIsOpen())}
    //             className="fi fi-sr-comment text-3xl mt-1"
    //           ></i>
    //           <p className="text-2xl mt-1">{comments.length}</p>
    //         </div>
    //       </div>

    //       <div>
    //         {content?.blocks?.map((block, index) => {
    //           if (block.type == "header") {
    //             if (block.data.level === 2) {
    //               return (
    //                 <h2
    //                   key={index}
    //                   dangerouslySetInnerHTML={{ __html: block.data.text }}
    //                 ></h2>
    //               );
    //             } else if (block.data.level === 3) {
    //               return (
    //                 <h3
    //                   dangerouslySetInnerHTML={{ __html: block.data.text }}
    //                 ></h3>
    //               );
    //             } else if (block.data.level === 4) {
    //               return (
    //                 <h4
    //                   dangerouslySetInnerHTML={{ __html: block.data.text }}
    //                 ></h4>
    //               );
    //             }
    //           } else if (block.type == "paragraph") {
    //             return (
    //               <p dangerouslySetInnerHTML={{ __html: block.data.text }}></p>
    //             );
    //           }
    //         })}
    //       </div>
    //     </div>
    //   ) : (
    //     <div className="text-center mt-10 text-xl">Loading blog...</div>
    //   )}

    //   {isOpen && <Comment />}
    // </div>

    <div className="max-w-[700px] mx-auto px-4 sm:px-6 lg:px-0">
      {blogData ? (
        <div>
          {/* Title */}
          <h1 className="mt-6 md:mt-10 font-bold text-2xl sm:text-3xl md:text-5xl lg:text-6xl capitalize leading-tight">
            {blogData.title}
          </h1>

          {/* Author */}
          <h2 className="my-3 md:my-5 text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-700">
            {blogData.creator.name}
          </h2>

          {/* Image */}
          <img
            src={blogData.image}
            alt=""
            className="w-full aspect-video object-cover rounded-lg"
          />

          {/* Edit/Delete Buttons */}
          {token && userId === blogData.creator._id && (
            <div className="flex flex-col sm:flex-row gap-3 mt-5">
              <Link to={`/edit/${blogData.blogId}`}>
                <button className="w-full sm:w-auto bg-green-500 px-4 py-2 text-base md:text-lg text-white rounded-md">
                  Edit
                </button>
              </Link>

              <button
                onClick={handleDeleteBlog}
                className="w-full sm:w-auto bg-red-500 px-4 py-2 text-base md:text-lg text-white rounded-md"
              >
                Delete
              </button>
            </div>
          )}

          {/* Like & Comment */}
          <div className="flex gap-6 md:gap-8 mt-5 items-center">
            <div
              className="cursor-pointer flex items-center gap-2"
              onClick={handleLike}
            >
              {islike ? (
                <i className="fi fi-sr-thumbs-up text-blue-600 text-xl md:text-2xl lg:text-3xl"></i>
              ) : (
                <i className="fi fi-br-social-network text-xl md:text-2xl lg:text-3xl"></i>
              )}
              <p className="text-lg md:text-xl">{likes.length}</p>
            </div>

            <div className="flex items-center gap-2">
              <i
                onClick={() => dispatch(setIsOpen())}
                className="fi fi-sr-comment text-xl md:text-2xl lg:text-3xl cursor-pointer"
              ></i>
              <p className="text-lg md:text-xl">{comments.length}</p>
            </div>
          </div>

          {/* Content */}
          <div className="mt-6 space-y-4 text-base md:text-lg leading-relaxed">
            {content?.blocks?.map((block, index) => {
              if (block.type == "header") {
                if (block.data.level === 2) {
                  return (
                    <h2
                      key={index}
                      className="text-xl md:text-2xl font-semibold"
                      dangerouslySetInnerHTML={{ __html: block.data.text }}
                    ></h2>
                  );
                } else if (block.data.level === 3) {
                  return (
                    <h3
                      key={index}
                      className="text-lg md:text-xl font-semibold"
                      dangerouslySetInnerHTML={{ __html: block.data.text }}
                    ></h3>
                  );
                } else if (block.data.level === 4) {
                  return (
                    <h4
                      key={index}
                      className="text-base md:text-lg font-semibold"
                      dangerouslySetInnerHTML={{ __html: block.data.text }}
                    ></h4>
                  );
                }
              } else if (block.type == "paragraph") {
                return (
                  <p
                    key={index}
                    className="text-gray-800"
                    dangerouslySetInnerHTML={{ __html: block.data.text }}
                  ></p>
                );
              }
            })}
          </div>
        </div>
      ) : (
        <div className="text-center mt-10 text-lg md:text-xl">
          Loading blog...
        </div>
      )}

      {isOpen && <Comment />}
    </div>
  );
}

export default BlogPage;
