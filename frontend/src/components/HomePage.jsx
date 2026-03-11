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
    <div className="w-[60%] mx-auto">
      {blogs.map((blog) => (
        <Link key={blog.blogId} to={`/blog/${blog.blogId}`}>
          <div className="w-full my-10 flex justify-between">
            <div className="w-[60%] flex flex-col gap-2">
              <h2 className="font-bold text-3xl">{blog.title}</h2>

              <h4 className="line-clamp-2">{blog.description}</h4>

              <div className="flex gap-7">
                <div className="flex gap-2">
                  <i className="fi fi-br-social-network text-lg mt-1"></i>
                  <p>{blog.likes?.length || 0}</p>
                </div>

                <div className="flex gap-2">
                  <i className="fi fi-sr-comment text-lg mt-1"></i>
                  <p>{blog.comments?.length || 0}</p>
                </div>
              </div>
            </div>

            <div className="w-[25%]">
              <img
                src={blog.image}
                alt={blog.title}
                loading="lazy"
                className="w-full object-cover rounded"
              />
            </div>
          </div>
        </Link>
      ))}

      {hasMore && (
        <div className="flex justify-center">
          <button
            onClick={() => setPage((prev) => prev + 1)}
            disabled={loading}
            className="px-4 py-2 bg-black text-white rounded"
          >
            {loading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
}

export default HomePage;
