const express = require("express"); 
const cors = require("cors"); 
const mongoose = require("mongoose"); 
const dotenv = require("dotenv"); 

const app = express(); // Tạo instance của Express app
app.use(cors()); 
app.use(express.json({ limit: "10mb" })); // Phân tích cú pháp dữ liệu JSON trong các yêu cầu có kích thước tối đa là 10 MB

dotenv.config(); // Nạp các biến môi trường vào đối tượng process.env

const PORT = process.env.PORT || 8080; 

// Kết nối với cơ sở dữ liệu MongoDB bằng giá trị chuỗi kết nối được lưu trữ trong biến env
console.log(process.env.MONGODB_URL); 
mongoose.set("strictQuery", false); // Vô hiệu hóa chế độ truy vấn nghiêm ngặt để sử dụng dễ dàng hơn
mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to database")) 
  .catch((error) => console.log("Error connecting to database: " + error));

// Xác định lược đồ người dùng cho bộ sưu tập MongoDB
const userSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  email: {
    type: String,
    required: true, // Trường email là bắt buộc
  },
  password: String,
  confirmPassword: String,
  image: String,
});

const userModel = new mongoose.model("user", userSchema); // Tạo model instance cho User schema để tương tác với MongoDB
module.exports = userModel; // Xuất UserModel để sử dụng ở nơi khác trong ứng dụng

app.get("/", (req, res) => {
  res.send("Server is running");  // Gửi phản hồi bằng văn bản
});

//sign up page
app.get("/signup", (req, res) => {
  res.send("This is the signup page."); // Gửi phản hồi bằng văn bản
});

app.post('/signup', async (req, res) => {
  console.log(req.body); // Nội dung yêu cầu ghi nhật ký cho mục đích gỡ lỗi
  const { email } = req.body; // Hủy cấu trúc trường email 
  try {
    const result = await userModel.findOne({ email: email }); // Tìm người dùng nếu đã tồn tại trong DB
    if (result) { // Nếu người dùng đã tồn tại
      res.send({ message: 'Email already registered', alert: false }); // Gửi thông báo lỗi
    } else { // Nếu người dùng không tồn tại trong DB
      const data = userModel(req.body); // Tạo dữ liệu người dùng mới
      const save = await data.save(); // Lưu dự liệu người dùng vào DB
      res.send({ // Gửi thông báo thành công
        message: 'User data has been successfully stored',
        alert: true,
      });
    }
  } catch (err) { // Bắt lỗi được đưa ra trong quá trình hoạt động không đồng bộ/chờ đợi
    console.log(err); 
    res.send({ message: 'Error occurred while saving user data', alert: false }); // Gửi thông báo lỗi
  }
});

app.get("/login", (req, res) => {
  res.send("This is the login page."); // Gửi phản hồi bằng văn bản
});

app.post('/login', async (req, res) => {
  console.log(req.body); 
  const { email } = req.body; 
  try {
    const result = await userModel.findOne({ email: email }); 
    if (result) { // Nếu người dùng được tìm thấy trong DB
      const dataSend = { // Xây dựng dữ liệu phản hồi để gửi tới giao diện người dùng máy khách
        _id: result._id,
        firstName: result.firstName,
        lastName: result.lastName,
        email: result.email,
        image: result.image,
      };
      console.log(dataSend); // Ghi lại dữ liệu phản hồi cho mục đích gỡ lỗi
      res.send({ // Gửi thông báo thành công và dữ liệu phản hồi được tạo
        message: 'Login is successful',
        alert: true,
        data: dataSend,
      });
    } else { // Nếu không tìm thấy người dùng trong DB
      res.send({ // Gửi thông báo lỗi
        message: 'Email is not available, please sign up',
        alert: false,
      });
    }
  } catch (error) { // Bắt lỗi được đưa ra trong quá trình hoạt động không đồng bộ/chờ đợi
    console.log(error); 
    res.send({ // Gửi thông báo lỗi
      message: 'Error occurred while finding user data',
      alert: false,
    });
  }
});

// Khởi động máy chủ
app.listen(PORT, () => console.log("Server is running at port: " + PORT));