const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const nodemailer = require("nodemailer")
const jwt = require("jsonwebtoken")
const bcrypt = require('bcrypt')

const accessTokenSecret = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"

const app = express() // Tạo instance của Express app
app.use(cors())
app.use(express.json({ limit: "10mb" })) // Phân tích cú pháp dữ liệu JSON trong các yêu cầu có kích thước tối đa là 10 MB

dotenv.config() // Nạp các biến môi trường vào đối tượng process.env  

const PORT = process.env.PORT || 8080

// Kết nối với cơ sở dữ liệu MongoDB bằng giá trị chuỗi kết nối được lưu trữ trong biến env
console.log(process.env.MONGODB_URL)
mongoose.set("strictQuery", false) // Vô hiệu hóa chế độ truy vấn nghiêm ngặt để sử dụng dễ dàng hơn
mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to database"))
  .catch((error) => console.log("Error connecting to database: " + error))

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
  verifytoken: String
})

const userModel = new mongoose.model("user", userSchema) // Tạo model instance cho User schema để tương tác với MongoDB
module.exports = userModel // Xuất UserModel để sử dụng ở nơi khác trong ứng dụng

app.get("/", (req, res) => {
  res.send("Server is running")  // Gửi phản hồi bằng văn bản
})

// Sign up page
app.get("/signup", (req, res) => {
  res.send("This is the signup page.")
})

app.post('/signup', async (req, res) => {
  const { email, password } = req.body
  try {
    const result = await userModel.findOne({ email: email })
    if (result) {
      res.status(400).json({
        message: 'Email already registered',
        alert: false
      })
    } else {
      const hashedPassword = await bcrypt.hash(password, 10) // Hash password using bcrypt
      const newUser = new userModel({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: email,
        password: hashedPassword,
        image: req.body.image,
        verifytoken: req.body.verifytoken
      })
      await newUser.save()
      res.status(200).json({
        message: 'You have successfully registered',
        alert: true,
      })
    }
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Error occurred while saving user data',
      alert: false
    })
  }
})

// Login page
app.get("/login", (req, res) => {
  res.send("This is the login page.")
})

app.post('/login', async (req, res) => {
  console.log(req.body)
  const { email, password } = req.body

  try {
    const result = await userModel.findOne({ email: email })

    if (result && await bcrypt.compare(password, result.password)) { // Compare input password with hash from database
      const dataSend = {
        _id: result._id,
        firstName: result.firstName,
        lastName: result.lastName,
        email: result.email,
        image: result.image,
      }

      res.send({
        message: 'Login is successful',
        alert: true,
        data: dataSend,
        background: '#00FF7F',
        color: 'white'
      })
    } else {
      // Email or password incorrect
      res.send({
        message: 'Email or Password is incorrect',
        alert: false,
        background: 'red',
        color: 'white'
      })
    }
  } catch (error) {
    console.log(error)
    res.send({
      message: 'Error occurred while finding user data',
      alert: false,
      background: 'red',
      color: 'white'
    })
  }
})

// Lấy thông tin tài khoản người dùng
app.get("/users/:userId", async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    return res.json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error." });
  }
});

// POST yêu cầu gửi OTP đến email người dùng
app.post('/send-otp', async (req, res) => {
  try {
    const userEmail = req.body.email;

    // Tìm thông tin người dùng dựa trên email trong database.
    const user = await userModel.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    // Tạo mã OTP ngẫu nhiên và băm nó sử dụng jwt
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const token = jwt.sign({ otp }, accessTokenSecret, { expiresIn: '10m' });

    // Cập nhật mã xác minh của người dùng với mã OTP mới trong database
    await userModel.findByIdAndUpdate(user._id, { $set: { verifytoken: token } });

    // Cấu hình nodemailer
    let transporter = nodemailer.createTransport({
      host: 'smtp.office365.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD
      },
      tls: {
        ciphers: 'SSLv3'
      }
    });

    // Gửi email với mã OTP và chuyển hướng người dùng đến trang nhập OTP
    let mailOptions = {
      from: `"Your Flower Shop" <${process.env.SMTP_USERNAME}>`,
      to: userEmail,
      subject: 'Your OTP Code',
      html: `<p>Your OTP code is: <b>${otp}</b></p><p>Please use this code within 10 minutes to reset your password.</p><a href="http://localhost:3000/resetpassword/${token}">Enter OTP code ></a>`
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        return res.status(500).json({ message: "Failed to send OTP!" });
      } else {
        console.log('Email sent: ' + info.response);
        return res.status(200).json({ message: "OTP has been sent to your email!" });
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to send OTP!" });
  }
});

// POST yêu cầu xác thực OTP và reset mật khẩu
app.post('/verify-otp', async (req, res) => {
  try {
    const { token, otp, newPassword } = req.body;

    // Xác minh mã thông báo OTP bằng mã OTP đầu vào
    const decodedToken = jwt.verify(token, accessTokenSecret);
    if (!decodedToken || decodedToken.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP code!" });
    }

    // Cập nhật mật khẩu của người dùng và xóa mã thông báo xác minh
    const user = await userModel.findOne({ verifytoken: token });
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

     // Hash mật khẩu mới
     const hashedPassword = await bcrypt.hash(newPassword, 10); 

     // Cập nhật mật khẩu đã được mã hóa vào CSDL và xóa đường dẫn xác thực
     user.password = hashedPassword;
     user.verifytoken = accessTokenSecret;
     await user.save();

    return res.status(200).json({ message: "Password has been reset successfully!" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "OTP verification failed!" });
  }
});

// Xác định lược đồ sản phẩm cho mongoose
const schemaProduct = mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: String, required: true },
  description: String,
})

// Tạo một mô hình sản phẩm với lược đồ đã xác định
const productModel = mongoose.model("product", schemaProduct)

// Lưu product trong db
app.post("/uploadProduct", async (req, res) => {
  const { name, category, image, price, description } = req.body // Trích xuất thông tin sản phẩm từ body của yêu cầu

  const newProduct = new productModel({
    name,
    category,
    image,
    price,
    description
  })

  try {
    const savedProduct = await newProduct.save() // Lưu sản phẩm mới vào database
    res.send({
      message: "Upload successfully",
      background: '#00FF7F',
      color: 'white'
    })
  } catch (err) {
    console.error(err)
    res.status(500).send("Error saving product")
  }
})

// Product page
app.get("/product", async (req, res) => {
  const data = await productModel.find({})
  res.send(data)
})

app.get("/product/:id", async (req, res) => {
  let data = await productModel.findOne({ _id: req.params.id })
  if (data) {
    res.send(data)
  } else {
    res.send("No Found")
  }
})

app.put("/product/:id", async (req, res) => {
  let data = await productModel.updateOne(
    { _id: req.params.id },
    { $set: req.body }
  )
  res.send(data, {
    message: "Update successfully"
  })
})

app.delete("/product/:id", async (req, res) => {
  let data = await productModel.deleteOne({ _id: req.params.id })
  res.send(data)
})

// const schemaCart = new mongoose.Schema(
//   {
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "user",
//       required: true,
//     },
//     cartItems: [
//       {
//         productId: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "product",
//           required: true,
//         },
//         quantity: { type: Number, default: 1 },
//       },
//     ],
//     createdAt: { type: Date, default: Date.now() },
//   },
//   { timestamps: true }
// );

// const cartModel = mongoose.model("cart", schemaCart);

// // Thêm sản phẩm vào giỏ hàng
// app.post("/cart/add-cart", async (req, res) => {
//   // Thêm sản phẩm vào giỏ hàng
//   const { userId, productId } = req.body;

//   // Tìm giỏ hàng đã có
//   let cart = await cartModel.findOne({ userId });

//   // Nếu không có, tạo mới giỏ hàng
//   if (!cart) {
//     cart = new Cart({ userId, cartItems: [{ product: productId }] });
//   } else {
//     // Nếu có rồi, thêm sản phẩm vào giỏ hàng
//     const index = cart.cartItems.findIndex(
//       (item) => item.productId.toString() === productId
//     )
//     if (index !== -1) {
//       // Nếu sản phẩm đã có trong giỏ hàng, chỉ cần tăng số lượng lên 1
//       cart.cartItems[index].quantity += 1;
//     } else {
//       // Nếu sản phẩm chưa có, thêm mới vào danh sách
//       cart.cartItems.push({ product: productId })
//     }
//   }

//   // Lưu giỏ hàng và trả về kết quả
//   await cart.save()
//   res.json(cart)
// })

// app.post("/cart/remove-item-cart", async (req, res) => {
//   const { userId, productId } = req.body;

//   // Tìm giỏ hàng
//   const cart = await cartModel.findOne({ userId });
//   if (!cart) {
//     return res.json({ success: false, message: "Cart not found" });
//   }

//   // Xóa sản phẩm khỏi danh sách
//   cart.cartItems = cart.cartItems.filter(
//     (item) => item.productId.toString() !== productId
//   );

//   // Lưu giỏ hàng và trả về kết quả
//   await cart.save();
//   res.json(cart);
// })

const purchaseSchema = new mongoose.Schema({
  // Define the properties of a purchase object
  fullname: String,
  email: String,
  address: String,
  phone: String,
  deliveryDate: Date,
  notice: String,
  paymentMethod: String,
  products: [{
    name: String,
    category: String,
    quantity: Number,
    total: Number
  }]
});

const purchaseModel = mongoose.model('Purchase', purchaseSchema);
module.exports = purchaseModel

app.post('/purchase', async (req, res) => {
  try {
    // Get the user ID from the logged-in user's session or JWT token
    const userId = req.session.userId;

    // Create a new purchase object from the received data
    const newPurchase = new Purchase({
      fullname: req.body.fullname,
      email: req.body.email,
      address: req.body.address,
      phone: req.body.phone,
      deliveryDate: req.body.delivery,
      notice: req.body.message,
      paymentMethod: req.body.paymentMethod,
      products: req.body.products
    });

    // Find the user by ID and add the new purchase to their purchases array
    const user = await userModel.findById(userId);
    user.purchases.push(newPurchase);
    await user.save();

    // Send a response back to the frontend indicating success
    res.json({ message: 'Purchase saved successfully' });
  } catch (error) {
    // Handle errors and send a response back to the frontend indicating failure
    res.status(500).json({ error: 'Failed to save purchase' });
  }
});

// Khởi động máy chủ
app.listen(PORT, () => {
  console.log(`Webflowwer app is listening at http://localhost:${PORT}`)
})