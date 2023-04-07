import React, { useEffect, useState } from 'react';
import { TbSend } from 'react-icons/tb';
import { useSelector, useDispatch } from 'react-redux';
import { loginRedux } from '../redux/userSlice';

const Comment = ({ productId }) => {
    const [comment, setComment] = useState("");
    const dispatch = useDispatch();
    const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
    const currentUserEmail = useSelector((state) => state.user.email);
    
    // Kiểm tra trạng thái đăng nhập của người dùng
    let username;
    if (isLoggedIn) {
        username = currentUserEmail;
    } else {
        username = "Anonymous";
    }

    const handleCommentSubmit = async () => {
        try {
            if (!productId) {
                alert("Product ID is required");
                return;
            }

            // Gửi mã khóa để xác minh danh tính của người dùng 
            const response = await fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/products/${productId}/comments`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ user: username, content: comment })
            });

            const data = await response.json();
            alert(data.message);
            setComment("");
        } catch (error) {
            console.log(error);
            alert("Failed to submit comment. Please try again later.");
        }
    };

    return (
        <div className="w-full py-5 max-w-4xl bg-white m-auto md:flex flex-col gap-2 justify-center">
            <label htmlFor="description" className="ml-2">Comment</label>
            <div className="flex flex-row text-center">
                <textarea
                    rows={2}
                    className="w-full bg-slate-200 p-1 ml-2 mr-2 mt-1 mb-3 resize-none"
                    name="description"
                    placeholder="Write some thing..."
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                />
                <span
                    className="flex items-center text-2xl py-5 p-2 mt-3 hover:bg-slate-300 rounded-full cursor-pointer h-10"
                    onClick={handleCommentSubmit}
                >
                    {<TbSend />}
                </span>
            </div>

            <p className="text-gray-600">Current user: {username}</p>
        </div>
    )
};

export default Comment;
