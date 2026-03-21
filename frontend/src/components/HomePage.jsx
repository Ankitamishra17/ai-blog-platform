import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function HomePage() {
  const [blogs, setBlogs] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  async function fetchBlogs() {
    if (loading || !hasMore) return;

    try {
      setLoading(true);

      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/blogs?page=${page}&limit=3`,
      );

      const newBlogs = res.data.blogs || [];

      setBlogs((prev) => [...prev, ...newBlogs]);

      setHasMore(res.data.hasMore);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBlogs();
  }, [page]);

  return (
    <div className="w-full sm:w-[90%] md:w-[80%] lg:w-[60%] mx-auto px-3">
      {blogs.map((blog) => (
        <Link key={blog.blogId} to={`/blog/${blog.blogId}`}>
          <div className="w-full my-8 flex flex-col md:flex-row gap-5 md:justify-between">
            {/* TEXT SECTION */}
            <div className="w-full md:w-[65%] flex flex-col gap-2">
              <h2 className="font-bold text-xl sm:text-2xl md:text-3xl">
                {blog.title}
              </h2>

              <h4 className="text-sm sm:text-base line-clamp-2">
                {blog.description}
              </h4>

              <div className="flex gap-6 text-sm sm:text-base">
                <div className="flex gap-2 items-center">
                  <i className="fi fi-br-social-network"></i>
                  <p>{blog.likes?.length || 0}</p>
                </div>

                <div className="flex gap-2 items-center">
                  <i className="fi fi-sr-comment"></i>
                  <p>{blog.comments?.length || 0}</p>
                </div>
              </div>
            </div>

            {/* IMAGE SECTION */}
            <div className="w-full md:w-[30%]">
              <img
                src={blog.image}
                alt={blog.title}
                loading="lazy"
                className="w-full h-48 md:h-full object-cover rounded"
              />
            </div>
          </div>
        </Link>
      ))}

      {hasMore && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setPage((prev) => prev + 1)}
            disabled={loading}
            className="px-5 py-2 bg-black text-white rounded text-sm sm:text-base"
          >
            {loading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
}

export default HomePage;
