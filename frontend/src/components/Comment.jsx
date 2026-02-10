import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setIsOpen } from "../utils/commentSlice";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { setCommentLikes, setComments } from "../utils/selectBlogSlice";
import { formatDate } from "../utils/formatData";

function Comment() {
  const dispatch = useDispatch();
  const [comment, setComment] = useState("");

  const { _id: blogId, comments } = useSelector((state) => state.selectedBlog);
  const { token, id: userId } = useSelector((state) => state.user);
  async function handleComment() {
    try {
      let res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/blogs/comment/${blogId}`,
        {
          comment,
        },
        {
          headers: {
            // "Content-Type" : "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log(res.data);

      dispatch(setComments(res.data.newComment));
      setComment("");
    } catch (error) {
      toast.error(error.response.data.message);
      // console.log(error)
    }
  }

  async function handleCommentLike(commentId) {
    console.log(commentId);
    try {
      let res = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/blogs/like-comment/${commentId}`,
        {},
        {
          headers: {
            // "Content-Type" : "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      toast.success(res.data.message);
      console.log(res.data);
      dispatch(setCommentLikes({ commentId, userId }));
    } catch (error) {
      toast.error(error.response.data.message);
      // console.log(error)
    }
  }
  return (
    <div className="bg-white h-screen fixed top-0 p-5 right-0 w-[400px] border-l drop-shadow-xl overflow-y-scroll">
      <div className="flex justify-between">
        <h1 className="text-xl font-medium"> Comment({comments.length})</h1>
        <i
          onClick={() => dispatch(setIsOpen(false))}
          className="fi fi-rr-cross-small mt-1 cursor-pointer"
        ></i>
      </div>

      <div className="my-4">
        <textarea
          type="text"
          placeholder="Comment....."
          className="h-[150px] resize-none drop-shadow w-full p-3 text-lg focus:outline-none"
          onChange={(e) => setComment(e.target.value)}
        />
        <button onClick={handleComment} className="bg-green-400 px-7py-3">
          Add
        </button>
      </div>

      <div>
        {comments.map((comment) => (
          <>
            <hr />
            <div className="flex flex-col gap-2 my-4">
              <div className="flex w-full justify-between">
                <div className="flex gap-2">
                  <div className="w-10 h-10">
                    <img
                      src={`https://api.dicebear.com/9.x/initials/svg?seed=${comment.user.name}`}
                      alt=""
                      className="rounded-full"
                    />
                  </div>
                  <div>
                    <p className="capitalize font-medium">
                      {comment.user.name}
                    </p>
                    <p>{formatDate(comment.createdAt)}</p>
                  </div>
                </div>
                <i className="fi fi-rr-menu-dots"></i>
              </div>

              <p className="font-medium text-lg">{comment.comment}</p>

              <div
                className=" cursor-pointer flex gap-2"
                onClick={() => handleCommentLike(comment._id)}
              >
                {comment.likes.includes(userId) ? (
                  <i className=" fi fi-sr-thumbs-up  text-blue-600 text-3xl rounded mt-1"></i>
                ) : (
                  <i className=" fi fi-br-social-network text-3xl mt-1"></i>
                )}
                <p className="text-2xl mt-1">{comment.likes.length}</p>
              </div>
            </div>
          </>
        ))}
      </div>
    </div>
  );
}

export default Comment;
