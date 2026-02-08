import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function SearchBlogs() {
  const [searchParams] = useSearchParams();
  const [blogs, setBlogs] = useState([]);
  const q = searchParams.get("q");

  useEffect(() => {
    async function fetchSearchBlogs() {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/v1/search-blog?search=${q}`,
        );
        setBlogs(res.data.blogs);
      } catch (error) {
        console.log(error);
      }
    }

    if (q) fetchSearchBlogs();
  }, [q]);

  return (
    <div className="w-[50%] mx-auto">
      <h1 className="text-3xl my-10">
        Results for <span className="font-bold">{q}</span>
      </h1>

      {blogs.length === 0 ? (
        <p>No blogs found.</p>
      ) : (
        blogs.map((blog) => (
          <div key={blog._id} className="border p-4 mb-4 rounded">
            <h2 className="text-xl font-bold">{blog.title}</h2>
            <p>{blog.description}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default SearchBlogs;
