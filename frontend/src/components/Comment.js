import React, { useEffect, useState } from 'react'
import BadWords from 'bad-words'
import { TbSend } from 'react-icons/tb'
import { useSelector } from 'react-redux'
import moment from 'moment'


const Comment = ({ productId }) => {
  const [comment, setComment] = useState("")
  const [commentsList, setCommentsList] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [commentsPerPage, setCommentsPerPage] = useState(5)

  const isLoggedIn = useSelector((state) => state.user.isLoggedIn)
  const currentUserEmail = useSelector((state) => state.user.email)
  const totalPages = Math.ceil(commentsList.length / commentsPerPage)

  function paginate(commentsList) {
    const indexOfLastComment = currentPage * commentsPerPage
    const indexOfFirstComment = indexOfLastComment - commentsPerPage
    const currentCommentsList = commentsList.slice(indexOfFirstComment, indexOfLastComment)

    return currentCommentsList
  }

  async function handleCommentSubmit() {
    try {
      if (!productId) {
        alert("Product ID is required")
        return
      }

      let userEmail

      // Nếu người dùng chưa đăng nhập, hãy tạo một tài khoản mới và đăng nhập
      if (!isLoggedIn) {
        // Tạo tên người dùng và mật khẩu ngẫu nhiên
        const username = Math.random().toString(36).substring(2)
        const password = Math.random().toString(36).substring(2)

        // Đăng nhập người dùng mới và lưu trữ mã thông báo truy cập trong bộ nhớ phiên
        const loginResponse = await fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ username, password })
        })
        const { accessToken } = await loginResponse.json()
        sessionStorage.setItem("accessToken", accessToken)

        userEmail = username // Sử dụng tên người dùng mới làm email cho bình luận
      } else {
        userEmail = currentUserEmail
      }

      // Kiểm duyệt ngôn ngữ xúc phạm
      const badWords = new BadWords()
      const censoredComment = badWords.clean(comment)

      // Gửi bình luận đến máy chủ
      const response = await fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/products/${productId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${sessionStorage.getItem("accessToken")}`
        },
        body: JSON.stringify({ user: userEmail, content: censoredComment })
      })

      console.log(response)
      const data = await response.json()
      alert(data.message)
      setComment("")
    } catch (error) {
      console.log(error)
      alert("Failed to submit comment. Please login to comment")
    }
  }

  useEffect(() => {
    async function fetchComments() {
      const response = await fetch(`${process.env.REACT_APP_SERVER_DOMAIN}/products/${productId}/comments`)
      const data = await response.json()
      setCommentsList(data.comments)
    }
    fetchComments()
  }, [productId])


  return (
    <div className="w-full py-5 max-w-4xl bg-white m-auto md:flex flex-col gap-2 justify-center">
      <label htmlFor="comment" className="ml-2">Comment</label>
      <div className="flex flex-row text-center">
        <textarea rows={2} className="w-full bg-slate-200 p-1 ml-2 mr-2 mt-1 mb-3 resize-none" name="description" placeholder={isLoggedIn ? "Write some thing..." : "You can leave a comment anonymously"} value={comment} onChange={e => setComment(e.target.value)} />
        <span className={`flex items-center text-2xl py-5 p-2 mt-3 hover:bg-slate-300 rounded-full cursor-pointer h-10`} onClick={handleCommentSubmit} >
          {<TbSend />}
        </span>
      </div>
      {isLoggedIn && <p className="text-gray-600">Current user: {currentUserEmail}</p>}

      {commentsList.length > 0 ? (
        <div className="mt-5">
          <h2 className="font-bold text-lg mb-2">{commentsList.length} Comment{commentsList.length > 1 ? 's' : ''}</h2>
          <ul>
            {paginate(commentsList).map((comment, index) => (
              <li key={index} className="bg-white p-4 my-2 rounded-lg shadow">
                <span className="font-medium mr-3">{comment.user}</span>
                <div>
                  <span>{comment.content}</span>
                  <span className="text-gray-500 text-sm mt-1 ml-2">
                    {moment(comment.createdAt).locale('vi').format('LLL')}
                  </span>
                </div>
              </li>
            ))}
          </ul>
          <div className="flex justify-center mt-5">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                className={`mx-1 px-3 py-2 rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <p>No comments yet</p>
      )}
    </div>
  )
}

export default Comment
