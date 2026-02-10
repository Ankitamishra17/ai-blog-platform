import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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

  async function fetchBlogById() {
    try {
      let {
        data: { blog },
      } =
        //  await axios.get(`http://localhost:3000/api/v1/blogs/${id}`);
        await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/blogs/${id}`,
        );

      setBlogData(blog);
      //setLikes(blog.likes.length);//no
      if (blog.likes.includes(userId)) {
        setIsLike((prev) => !prev);
      }

      dispatch(addSelectedBlog(blog));
      // console.log(res)
    } catch (error) {
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

      let res = await axios.post(
        `http://localhost:3000/api/v1/blogs/like/${blogData._id}`,
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

  return (
    <div className="max-w-[700px] mx-auto">
      {blogData ? (
        <div>
          <h1 className="mt-10 font-bold text-6xl capitalize">
            {blogData.title}
          </h1>
          <h2 className="my-5 text-3xl">{blogData.creator.name}</h2>
          <img src={blogData.image} alt="" />

          {token && email === blogData.creator.email && (
            <Link to={`/edit/${blogData.blogId}`}>
              <button className="bg-green-500 mt-5 px-6 py-2 text-xl">
                Edit
              </button>
            </Link>
          )}
          <div className="flex gap-7 mt-4">
            <div className=" cursor-pointer flex gap-2" onClick={handleLike}>
              {islike ? (
                <i className=" fi fi-sr-thumbs-up  text-blue-600 text-3xl rounded mt-1"></i>
              ) : (
                <i className=" fi fi-br-social-network text-3xl mt-1"></i>
              )}
              <p className="text-2xl mt-1">{likes.length}</p>
            </div>

            <div className="flex gap-2">
              <i
                onClick={() => dispatch(setIsOpen())}
                className="fi fi-sr-comment text-3xl mt-1"
              ></i>
              <p className="text-2xl mt-1">{comments.length}</p>
            </div>
          </div>

          <div>
            {content.blocks.map((block) => {
              if (block.type == "header") {
                if (block.data.level === 2) {
                  return (
                    <h2
                      dangerouslySetInnerHTML={{ __html: block.data.text }}
                    ></h2>
                  );
                } else if (block.data.level === 3) {
                  return (
                    <h3
                      dangerouslySetInnerHTML={{ __html: block.data.text }}
                    ></h3>
                  );
                } else if (block.data.level === 4) {
                  return (
                    <h4
                      dangerouslySetInnerHTML={{ __html: block.data.text }}
                    ></h4>
                  );
                }
              } else if (block.type == "paragraph") {
                return (
                  <p dangerouslySetInnerHTML={{ __html: block.data.text }}></p>
                );
              }
            })}
          </div>
        </div>
      ) : (
        <h1>Loading......</h1>
      )}

      {isOpen && <Comment />}
    </div>
  );
}

export default BlogPage;
