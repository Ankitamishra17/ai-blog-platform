import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

//import formatDate from "../utils/formatDate";

function HomePage() {
  const [blogs, setBlogs] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  async function fetchBlogs() {
    let res = await axios.get(
      `http://localhost:3000/api/v1/blogs?page=${page}&limit=3`,
    );
    //let res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/blogs`)

    //console.log(res.data.blogs)

    setBlogs((prev) => [...prev, ...res.data.blogs]);
    setHasMore(res.data.hasMore);
  }

  useEffect(() => {
    fetchBlogs();
  }, [page]);

  return (
    <div className="w-[60%] mx-auto">
      {blogs.map((blog) => (
        <Link key={blog.blogId} to={`/blog/${blog.blogId}`}>
          <div className="w-full my-10  flex justify-between">
            <div className="w-[60%] flex flex-col gap-2">
              <div>
                <img src="" alt="" />
                {/* <p>{blog.creator.name}</p> */}
              </div>
              <h2 className="font-bold text-3xl">{blog.title}</h2>
              <h4 className="line-clamp-2"> {blog.description}</h4>
              <div className="flex gap-5">
                {/* <p>{formatDate(blog.createdAt)}</p> esco sahi karna h */}

                <div className="flex gap-7 ">
                  <div className=" cursor-pointer flex gap-2">
                    <i className=" fi fi-br-social-network text-lg mt-1"></i>
                    <p className="text-lg ">{blog.likes.length}</p>
                  </div>

                  <div className="flex gap-2">
                    <i className="fi fi-sr-comment text-lg mt-1"></i>
                    <p className="text-lg ">{blog.comments.length}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-[25%]">
              <img src={blog.image} alt="" />
            </div>
          </div>
        </Link>
      ))}
      {hasMore && (
        <button
          onClick={() => setPage((prev) => prev + 1)}
          className="px-4 py-2 bg-black text-white rounded"
        >
          Load More
        </button>
      )}
    </div>
  );
}

export default HomePage;
