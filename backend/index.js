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

// Sign up page
app.get("/signup", (req, res) => {
  res.send("This is the signup page.");
});

app.post('/signup', async (req, res) => {
  const { email } = req.body;
  try {
    const result = await userModel.findOne({ email: email });
    if (result) {
      res.status(400).json({ message: 'Email already registered', alert: false });
    } else {
      const newUser = new userModel(req.body);
      await newUser.save();
      res.status(200).json({
        message: 'User data has been successfully stored',
        alert: true,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Error occurred while saving user data',
      alert: false,
    });
  }
});

// Login page
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
        background: '#00FF7F',
        color: 'white'
      });
    } else { // Nếu không tìm thấy người dùng trong DB
      res.send({ // Gửi thông báo lỗi
        message: 'Email is not available, please sign up',
        alert: false,
        background: 'red',
        color: 'white'
      });
    }
  } catch (error) { // Bắt lỗi được đưa ra trong quá trình hoạt động không đồng bộ/chờ đợi
    console.log(error);
    res.send({ // Gửi thông báo lỗi
      message: 'Error occurred while finding user data',
      alert: false,
      background: 'red',
      color: 'white'
    });
  }
});

// Xác định lược đồ sản phẩm cho mongoose
const schemaProduct = mongoose.Schema({
  name: String,
  category: String,
  image: String,
  price: String,
  description: String
});

// Tạo một mô hình sản phẩm với lược đồ đã xác định
const productModel = mongoose.model("product", schemaProduct)

// Lưu product trong db
app.post("/uploadProduct", async (req, res) => {
  console.log(req.body)
  const data = await productModel(req.body) // Tạo một tài liệu mới từ dữ liệu nội dung yêu cầu nhận được
  const datasave = await data.save() // Lưu tài liệu mới vào cơ sở dữ liệu
  res.send({
    message: "Upload successfully",
    background: '#00FF7F',
    color: 'white'
  }) // Gửi phản hồi xác nhận upload thành công
})

//  Product page
app.get("/product", async (req, res) => {
  const data = await productModel.find({})
  res.send(data)
})

// Khởi động máy chủ
app.listen(PORT, () => console.log("Server is running at port: " + PORT));