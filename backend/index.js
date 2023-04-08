const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const nodemailer = require("nodemailer")
const jwt = require("jsonwebtoken")
const bcrypt = require('bcrypt')
const paymentmomo = require("./momopayment")


const accessTokenSecret = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"

const app = express() // Tạo instance của Express app
app.use(cors())
app.use(express.json({ limit: "100mb" })) // Phân tích cú pháp dữ liệu JSON trong các yêu cầu có kích thước tối đa là 10 MB

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
  const { email } = req.body
  try {
    const result = await userModel.findOne({ email: email })
    if (result) {
      res.status(400).json({ message: 'Email already registered', alert: false })
    } else {
      const newUser = new userModel(req.body)
      await newUser.save()
      res.status(200).json({
        message: 'User data has been successfully stored',
        alert: true,
      })
    }
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Error occurred while saving user data',
      alert: false,
    })
  }
})


// Login page
app.get("/login", (req, res) => {
  res.send("This is the login page.")
})

app.post('/login', async (req, res) => {
  const { email, password } = req.body

  try {
    const result = await userModel.findOne({ email: email })

    if (result && await bcrypt.compare(password, result.password)) { // Compare input password with hash from database
      const token = jwt.sign({ email: result.email }, accessTokenSecret); // Xuất JWT với payload là email

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
        token: token, // Gửi JWT về phía client
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
    image.pngimage.png

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

    // Đặt mật khẩu mới và xóa mã thông báo xác minh
    user.password = newPassword;
    user.verifytoken = '';
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
  comments: [{
    user: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now()
    }
  }]
})

// Tạo một mô hình sản phẩm với lược đồ đã xác định
const productModel = mongoose.model("product", schemaProduct)

module.exports = productModel


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
//  Product page
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

// API endpoint: Lấy tất cả các comment trong database
app.get('/comments', async (req, res) => {
  try {
    const comments = await commentModel.find()
    res.json(comments)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// const authenticateToken = (req, res, next) => {
//   const authHeader = req.headers['authorization']
//   const token = authHeader && authHeader.split(' ')[1]

//   if (token == null) {
//     req.$user = null;
//     return next()
//   }

//   jwt.verify(token, accessTokenSecret, (err, user) => {
//     if (err) {
//       req.$user = null;
//       return next();
//     }

//     console.log(`User ${user.email} is authenticated.`)

//     localStorage.setItem()

//     // Save user information to context of the request
//     req.$user = user
//     next()
//   })
// }

app.post('/products/:id/comments', async (req, res) => {
  try {
    const productId = req.params.id;
    const { content } = req.body;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new Error('Invalid product ID')
    }

    const product = await productModel.findById(productId);

    if (!product) {
      throw new Error('Product not found');
    }

    let user;
    if (req.user && req.user.email) {
      user = req.user.email;
    } else {
      user = 'Anonymous';
    }

    const comment = { user, content };

    product.comments.push(comment);
    await product.save();

    res.status(201).json({ message: 'Comment created' });
    console.log(product)
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: error.message })
  }
});
//Admin - user 
app.get("/listuser", async (req, res) => {
  const data = await userModel.find({})
  res.send(data)
})
app.get("/chartproduct", async (req, res) => {
  const topProducts = await billdetailModel.aggregate([
    {
      $group: {
        _id: "$productid",
        totalQuantity: { $sum: "$quantity" }
      }
    },
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "_id",
        as: "product"
      }
    },
    {
      $project: {
        name: { $arrayElemAt: ["$product.name", 0] },
        totalQuantity: 1
      }
    },
    {
      $sort: {
        totalQuantity: -1 // Sort in descending order
      }
    },
    {
      $limit: 5 // Select top 5
    }
  ]);
  const allBills = await billModel.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "userid",
        foreignField: "_id",
        as: "user"
      },
    },
    {
      $sort: {
        date: -1
      }
    }
  ]);
  const data = {
    topProducts: topProducts,
    allBills: allBills
  };
  res.send(JSON.stringify(data));

})
app.get("/invoicebill", async (req, res) => {

  const result = await billdetailModel.aggregate([
    {
      // Bước 1: Tìm kiếm thông tin chi tiết hóa đơn với mã hóa đơn là 'HD001'
      $match: { billid: new mongoose.Types.ObjectId(req.query.idbill) }
    },
    {
      // Bước 2: Join với bảng sản phẩm để lấy thông tin sản phẩm
      $lookup: {
        from: 'products', // Tên bảng sản phẩm
        localField: 'productid', // Trường liên kết trong bảng chi tiết hóa đơn
        foreignField: '_id', // Trường liên kết trong bảng sản phẩm
        as: 'product' // Tên trường chứa thông tin sản phẩm sau khi join
      }
    },
    {
      // Bước 3: Join với bảng người dùng để lấy thông tin người dùng
      $lookup: {
        from: 'users', // Tên bảng người dùng
        localField: 'userid', // Trường liên kết trong bảng chi tiết hóa đơn
        foreignField: '_id', // Trường liên kết trong bảng người dùng
        as: 'user' // Tên trường chứa thông tin người dùng sau khi join
      }
    },
    {
      // Bước 3: Join với bảng người dùng để lấy thông tin người dùng
      $lookup: {
        from: 'bills', // Tên bảng người dùng
        localField: 'billid', // Trường liên kết trong bảng chi tiết hóa đơn
        foreignField: '_id', // Trường liên kết trong bảng người dùng
        as: 'bill' // Tên trường chứa thông tin người dùng sau khi join
      }
    },
    {
      // Bước 4: Định dạng lại kết quả trả về
      $project: {
        _id: 0,
        billdetail_id: '$_id',
        quantity: '$quantity',
        product: { $arrayElemAt: ['$product', 0] },
        user: { $arrayElemAt: ['$user', 0] },
        bill: { $arrayElemAt: ['$bill', 0] }
      }
    }
  ]);

  //console.log(req.query.idbill)
  res.send(result)

})
// END ADMIN

const billdetailSchema = mongoose.Schema({
  productid: mongoose.Schema.Types.ObjectId,
  billid: mongoose.Schema.Types.ObjectId,
  quantity: Number
})

const billdetailModel = new mongoose.model("Billdetail", billdetailSchema) // Tạo model instance cho User schema để tương tác với MongoDB
module.exports = billdetailModel // Xuất billdetail để sử dụng ở nơi khác trong ứng dụng


const createbilldetail = function (productid, billid, quantity) {
  const billdetail = new billdetailModel({
    productid,
    billid,
    quantity
  });

  return billdetail.save();
};

const billSchema = mongoose.Schema({
  userid: mongoose.Schema.Types.ObjectId,
  total: String,
  date: String,
  note: String,
  method: String,
  address: String,
})

const billModel = new mongoose.model("Bill", billSchema) // Tạo model instance cho User schema để tương tác với MongoDB
module.exports = billModel // Xuất billdetail để sử dụng ở nơi khác trong ứng dụng


const createbill = function (userid, total, date, note, method, address) {
  const billdetail = new billModel({
    userid,
    total,
    date,
    note,
    method,
    address
  });

  return billdetail.save();
};

app.post('/checkout', async (req, res) => {


  const { productCartItem, userid, totalPrice, Note, paymentMethod, address } = req.body
  try {
    var today = new Date()
    if (today.getMonth() + 1 < 10)
      var month = '0' + (today.getMonth() + 1)
    else var month = today.getMonth()
    if (today.getDate() < 10)
      var dates = '0' + today.getDate()

    else var dates = today.getDate()
    date = today.getFullYear() + '/' + month + '/' + dates;
    await createbill(userid, totalPrice, date, Note, paymentMethod, address)
      .then(bill => {


        let idbill = bill._id
        console.log("> Created new billid\n", idbill);
        productCartItem.map(async e => {
          let productid = e._id
          let quantity = e.quanity
          createbilldetail(productid, idbill, quantity)
            .then(billdetail => {
              console.log("> Created new Customer\n", billdetail);
            })
        })
      })
    res.status(200).json({
      message: 'bill create has been successfully stored',
      alert: true,
    })
  }
  catch (err) { console.log(err) }

})
//momo payment
app.get("/momo", async (req, res) => {
  try {
    const url = await paymentmomo(2000)// amount

    res.send(JSON.stringify(url));
  } catch (err) {
    console.error(err); // log any errors to the console
    res.status(500).send('Internal Server Error'); // return an error message to the client
  }
});
// Khởi động máy chủ
app.listen(PORT, () => {
  console.log(`Webflowwer app is listening at http://localhost:${PORT}`)
})


