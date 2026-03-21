// import React, { useState, useEffect, useRef } from "react";
// import { useNavigate, useParams, Navigate } from "react-router-dom";
// import axios from "axios";
// import { toast } from "react-hot-toast";
// import EditorJS from "@editorjs/editorjs";
// import EditorjsList from "@editorjs/list";
// import CodeTool from "@editorjs/code";
// import Marker from "@editorjs/marker";
// import Header from "@editorjs/header";

// import { useSelector } from "react-redux";

// function AddBlog() {
//   const { id } = useParams();
//   const editorjsRef = useRef(null);
//   const navigate = useNavigate();

//   const { token } = useSelector((slice) => slice.user);

//   const { title, description, image } = useSelector(
//     (slice) => slice.selectedBlog,
//   );

//   const [blogData, setBlogData] = useState({
//     title: "",
//     description: "",
//     image: null,
//     content: "",
//   });

//   // 🔹 Initialize EditorJS
//   function initializeEditor() {
//     editorjsRef.current = new EditorJS({
//       holder: "editorjs",
//       placeholder: "Write something...",
//       tools: {
//         header: {
//           class: Header,
//           inlineToolbar: true,
//           config: {
//             placeholder: "Enter header",
//             levels: [1, 2, 3],
//             defaultLevel: 2,
//           },
//         },
//         list: {
//           class: EditorjsList,
//           inlineToolbar: true,
//           config: {
//             defaultStyle: "unordered",
//           },
//         },
//         code: CodeTool,
//         marker: Marker,
//       },

//       async onChange() {
//         const data = await editorjsRef.current.save();
//         setBlogData((prev) => ({ ...prev, content: data }));
//       },
//     });
//   }

//   // 🔹 Post Blog
//   // async function handlePostBlog() {
//   //   try {
//   //     const res = await axios.post(
//   //       `${import.meta.env.VITE_BACKEND_URL}/api/v1/blogs`,
//   //       blogData,
//   //       {
//   //         headers: {
//   //           "Content-Type": "multipart/form-data",
//   //           Authorization: `Bearer ${token}`,
//   //         },
//   //       },
//   //     );

//   //     toast.success(res.data.message);
//   //     navigate("/");
//   //   } catch (error) {
//   //     toast.error(error?.response?.data?.message || "Error posting blog");
//   //   }
//   // }

//   async function handlePostBlog() {
//     try {
//       const formData = new FormData();

//       formData.append("title", blogData.title);
//       formData.append("description", blogData.description);
//       formData.append("content", JSON.stringify(blogData.content));

//       if (blogData.image) {
//         formData.append("image", blogData.image);
//       }

//       const res = await axios.post(
//         `${import.meta.env.VITE_BACKEND_URL}/api/v1/blogs`,
//         formData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         },
//       );

//       toast.success(res.data.message);
//       navigate("/");
//     } catch (error) {
//       toast.error(error?.response?.data?.message || "Error posting blog");
//     }
//   }

//   // 🔹 Update Blog
//   // async function handleUpdateBlog() {
//   //   try {
//   //     const res = await axios.patch(
//   //       `${import.meta.env.VITE_BACKEND_URL}/api/v1/blogs/${id}`,
//   //       blogData,
//   //       {
//   //         headers: {
//   //           "Content-Type": "multipart/form-data",
//   //           Authorization: `Bearer ${token}`,
//   //         },
//   //       },
//   //     );

//   //     toast.success(res.data.message);
//   //     navigate("/");
//   //   } catch (error) {
//   //     toast.error(error?.response?.data?.message || "Error updating blog");
//   //   }
//   // }

//   async function handleUpdateBlog() {
//     try {
//       const formData = new FormData();

//       formData.append("title", blogData.title);
//       formData.append("description", blogData.description);
//       formData.append("content", JSON.stringify(blogData.content));

//       if (blogData.image) {
//         formData.append("image", blogData.image);
//       }

//       const res = await axios.patch(
//         `${import.meta.env.VITE_BACKEND_URL}/api/v1/blogs/${id}`,
//         formData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         },
//       );

//       toast.success(res.data.message);
//       navigate("/");
//     } catch (error) {
//       toast.error(error?.response?.data?.message || "Error updating blog");
//     }
//   }

//   // 🔹 Fetch Blog Data
//   function fetchBlogById() {
//     setBlogData({
//       title,
//       description,
//       image,
//       content: {},
//     });
//   }

//   useEffect(() => {
//     if (id) {
//       fetchBlogById();
//     }
//   }, [id]);

//   // 🔹 Initialize Editor
//   useEffect(() => {
//     if (!editorjsRef.current) {
//       initializeEditor();
//     }

//     return () => {
//       if (editorjsRef.current) {
//         editorjsRef.current.destroy();
//         editorjsRef.current = null;
//       }
//     };
//   }, []);

//   // 🔹 Protect Route
//   if (!token) {
//     return <Navigate to="/signin" />;
//   }

//   return (
//     <div className="w-[500px] mx-auto">
//       {/* Title */}
//       <div className="my-4">
//         <h2 className="text-2xl font-semibold my-2">Title</h2>
//         <input
//           type="text"
//           placeholder="Title"
//           value={blogData.title}
//           onChange={(e) =>
//             setBlogData((prev) => ({ ...prev, title: e.target.value }))
//           }
//           className="border rounded-lg w-full p-2 text-lg focus:outline-none"
//         />
//       </div>

//       {/* Description */}
//       <div className="my-4">
//         <h2 className="text-2xl font-semibold my-2">Description</h2>
//         <textarea
//           value={blogData.description}
//           placeholder="Description"
//           className="h-[100px] resize-none w-full p-3 rounded-lg border text-lg focus:outline-none"
//           onChange={(e) =>
//             setBlogData((prev) => ({
//               ...prev,
//               description: e.target.value,
//             }))
//           }
//         />
//       </div>

//       {/* EditorJS */}
//       <div className="my-4">
//         <h2 className="text-2xl font-semibold my-2">Content</h2>
//         <div
//           id="editorjs"
//           className="border rounded-lg p-3 min-h-[200px]"
//         ></div>
//       </div>

//       {/* Image Upload */}
//       <div>
//         <h2 className="text-2xl font-semibold my-2">Image</h2>

//         <label htmlFor="image">
//           {blogData.image ? (
//             <img
//               src={
//                 typeof blogData.image === "string"
//                   ? blogData.image
//                   : URL.createObjectURL(blogData.image)
//               }
//               alt="blog"
//               className="aspect-video object-cover border rounded-lg"
//             />
//           ) : (
//             <div className="bg-white border rounded-lg aspect-video opacity-50 flex justify-center items-center text-2xl">
//               Select Image
//             </div>
//           )}
//         </label>

//         <input
//           id="image"
//           type="file"
//           className="hidden"
//           onChange={(e) =>
//             setBlogData((prev) => ({
//               ...prev,
//               image: e.target.files[0],
//             }))
//           }
//         />
//       </div>

//       {/* Submit Button */}
//       <button
//         className="bg-blue-500 text-lg py-3 px-6 rounded-full text-white font-semibold my-6"
//         onClick={id ? handleUpdateBlog : handlePostBlog}
//       >
//         {id ? "Update Blog" : "Post Blog"}
//       </button>
//     </div>
//   );
// }

// export default AddBlog;

import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, Navigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import EditorJS from "@editorjs/editorjs";
import EditorjsList from "@editorjs/list";
import CodeTool from "@editorjs/code";
import Marker from "@editorjs/marker";
import Header from "@editorjs/header";
import { useSelector } from "react-redux";

function AddBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const editorRef = useRef(null);

  const { token } = useSelector((state) => state.user);
  const selectedBlog = useSelector((state) => state.selectedBlog);

  const [blogData, setBlogData] = useState({
    title: "",
    description: "",
    image: null,
    content: {},
  });

  // ✅ Initialize EditorJS
  useEffect(() => {
    if (editorRef.current) return;

    const editor = new EditorJS({
      holder: "editorjs",
      placeholder: "Write your blog content...",
      tools: {
        header: Header,
        list: EditorjsList,
        code: CodeTool,
        marker: Marker,
      },
      async onChange(api) {
        const data = await api.saver.save();
        setBlogData((prev) => ({ ...prev, content: data }));
      },
    });

    editorRef.current = editor;

    return () => {
      if (editorRef.current && editorRef.current.destroy) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, []);

  // ✅ Load existing blog (Edit mode)
  useEffect(() => {
    if (id && selectedBlog) {
      setBlogData({
        title: selectedBlog.title || "",
        description: selectedBlog.description || "",
        image: selectedBlog.image || null,
        content: selectedBlog.content || {},
      });
    }
  }, [id, selectedBlog]);

  // ✅ Submit (Create / Update)
  const handleSubmit = async () => {
    try {
      const formData = new FormData();

      formData.append("title", blogData.title);
      formData.append("description", blogData.description);
      formData.append("content", JSON.stringify(blogData.content));

      if (blogData.image) {
        formData.append("image", blogData.image);
      }

      const url = id
        ? `${import.meta.env.VITE_BACKEND_URL}/api/v1/blogs/${id}`
        : `${import.meta.env.VITE_BACKEND_URL}/api/v1/blogs`;

      const method = id ? "patch" : "post";

      const res = await axios({
        method,
        url,
        data: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success(res.data.message);
      navigate("/");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  // ✅ Protect route
  if (!token) return <Navigate to="/signin" />;

  return (
    <div className="w-full sm:w-[90%] md:w-[70%] lg:w-[50%] mx-auto px-4 py-6">
      {/* TITLE */}
      <div className="mb-5">
        <h2 className="text-xl sm:text-2xl font-semibold mb-2">Title</h2>
        <input
          type="text"
          value={blogData.title}
          onChange={(e) =>
            setBlogData((prev) => ({ ...prev, title: e.target.value }))
          }
          placeholder="Enter title"
          className="w-full border rounded-lg p-3 text-base focus:outline-none"
        />
      </div>

      {/* DESCRIPTION */}
      <div className="mb-5">
        <h2 className="text-xl sm:text-2xl font-semibold mb-2">Description</h2>
        <textarea
          value={blogData.description}
          onChange={(e) =>
            setBlogData((prev) => ({
              ...prev,
              description: e.target.value,
            }))
          }
          placeholder="Enter description"
          className="w-full h-[120px] resize-none border rounded-lg p-3 focus:outline-none"
        />
      </div>

      {/* EDITOR */}
      <div className="mb-5">
        <h2 className="text-xl sm:text-2xl font-semibold mb-2">Content</h2>
        <div
          id="editorjs"
          className="border rounded-lg p-3 min-h-[300px]"
        ></div>
      </div>

      {/* IMAGE */}
      <div className="mb-5">
        <h2 className="text-xl sm:text-2xl font-semibold mb-2">Image</h2>

        <label htmlFor="image">
          {blogData.image ? (
            <img
              src={
                typeof blogData.image === "string"
                  ? blogData.image
                  : URL.createObjectURL(blogData.image)
              }
              alt="preview"
              className="w-full aspect-video object-cover rounded-lg border cursor-pointer"
            />
          ) : (
            <div className="w-full aspect-video border rounded-lg flex items-center justify-center text-gray-400 cursor-pointer">
              Click to upload image
            </div>
          )}
        </label>

        <input
          type="file"
          id="image"
          className="hidden"
          onChange={(e) =>
            setBlogData((prev) => ({
              ...prev,
              image: e.target.files[0],
            }))
          }
        />
      </div>

      {/* BUTTON */}
      <button
        onClick={handleSubmit}
        className="w-full bg-blue-500 text-white py-3 rounded-full text-lg font-semibold hover:bg-blue-600 transition"
      >
        {id ? "Update Blog" : "Post Blog"}
      </button>
    </div>
  );
}

export default AddBlog;
