import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, Navigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import EditorJS from "@editorjs/editorjs";
import EditorjsList from "@editorjs/list";
import NesteList from "@editorjs/nested-list";
import CodeTool from "@editorjs/code";
import Marker from "@editorjs/marker";
import Header from "@editorjs/header";

import { useSelector } from "react-redux";
import NestedList from "@editorjs/nested-list";

function AddBlog() {
  const { id } = useParams();
  //console.log(id);
  const editorjsRef = useRef(null);
  const navigate = useNavigate();
  //const token = JSON.parse(localStorage.getItem("token"));

  const { token } = useSelector((slice) => slice.user);

  //const selectedBlog = useSelector((slice) => slice.selectedBlog);
  const { title, description, image } = useSelector(
    (slice) => slice.selectedBlog,
  );

  const [blogData, setblogData] = useState({
    title: "",
    description: "",
    image: null,
    content: "",
  });

  async function handlePostBlog() {
    //console.log(blogData);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/blogs`,
        blogData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      URL.createObjectURL(blogData.image);
      console.log(res);
      toast.success(res.data.message);
      navigate("/");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  async function handleUpdateBlog() {
    try {
      const res = await axios.patch(
        "http://localhost:3000/api/v1/blogs/" + id,
        blogData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      URL.createObjectURL(blogData.image);
      console.log(res);
      toast.success(res.data.message);
      navigate("/");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }

  async function fetchBlogById() {
    // try{
    //   let res = await axios.get(`http://localhost:3000/api/v1/blogs/${id}`);
    //
    //  console.log(res.data)
    // }
    // catch(error) {
    //   toast.error(error.response?.data?.message || error.message || "Something went wrong");
    // }

    setblogData({
      title: title,
      description: description,
      image: image,
    });
  }

  function initializedEditorjs() {
    editorjsRef.current = new EditorJS({
      holder: "editorjs",
      placeholder: "write something....",
      tools: {
        header: {
          class: Header,
          inlineToolbar: true,
          config: {
            placeholder: "Enter a header",
            levels: [1, 2, 3],
            defaultLevel: 3,
          },
        },

        List: {
          class: EditorjsList,
          // class: NestedList,
          inlineToolbar: true,
          config: {
            defaultStyle: "unordered",
          },
        },
        code: CodeTool,
        Marker: Marker,
      },
      onChange: async () => {
        let data = await editorjsRef.current.save();
        //console.log(data);
        setblogData((blogData) => ({ ...blogData, content: data }));
      },
    });
  }

  useEffect(() => {
    if (id) {
      fetchBlogById();
    }
  }, [id]);

  useEffect(() => {
    if (editorjsRef.current === null) {
      initializedEditorjs();
    }

    return () => {
      editorjsRef.current = null;
    };
  }, []);

  // const navigate = useNavigate

  // useEffect(()=>{
  //   if(!token) {
  //     return navigate("/signin");
  //   }
  // },[] )
  // second method for check

  return token == null ? (
    <Navigate to={"/signin"} />
  ) : (
    <div className="w-[500px] mx-auto">
      <div className="my-4">
        <h2 className="text-2xl font-semibold my-2">Title</h2>
        <input
          type="text"
          placeholder="title"
          onChange={(e) =>
            setblogData((blogData) => ({
              ...blogData,
              title: e.target.value,
            }))
          }
          value={blogData.title}
          className="border focus:outline-none rounded-lg w-1/2 p-2 placeholder: text-lg"
        />
      </div>
      <br />

      <div className="my-4">
        <h2 className="text-2xl font-semibold my-2">Description</h2>
        <textarea
          type="text"
          placeholder="description"
          className="h-[100px] resize-none w-full p-3 rounded-lg border text-lg focus:outline-none"
          onChange={(e) =>
            setblogData((blogData) => ({
              ...blogData,
              description: e.target.value,
            }))
          }
        />

        {/* value={blogData.description} */}
      </div>
      <br />
      <div id="editorjs"></div>
      <div>
        <h2 className="text-2xl font-semibold my-2">Image</h2>
        <label htmlFor="image">
          {blogData.image ? (
            <img
              src={
                typeof blogData.image === "string"
                  ? blogData.image
                  : URL.createObjectURL(blogData.image)
              }
              alt=""
              className='="aspect-video object-cover border rounded-lg'
            />
          ) : (
            <div
              className="bg-white border rounded-lg aspect-video opacity-50 flex justify-center 
          items-center text-4xl"
            >
              Select Image
            </div>
          )}
        </label>

        <input
          className="hidden"
          id="image"
          type="file"
          // accept=".png , .jpeg, .jpg"
          onChange={(e) =>
            setblogData((blogData) => ({
              ...blogData,
              image: e.target.files[0],
            }))
          }
        />
      </div>

      <div className="my-4">
        <h2 className="text-2xl font-semibold my-2">Content</h2>
        <div id="editorjs" className=""></div>
      </div>
      <button
        className="bg-blue-500 text-lg py-4 px-7 rounded-full text-white font-semibold my-6"
        onClick={id ? handleUpdateBlog : handlePostBlog}
      >
        {id ? "Update blog" : "Post blog"}
      </button>
    </div>
  );
}

export default AddBlog;
