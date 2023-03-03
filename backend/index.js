const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

dotenv.config();

const PORT = process.env.PORT || 8080;

// Connect to MongoDB
console.log(process.env.MONGODB_URL);
mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to database"))
  .catch((error) => console.log("Error connecting to database: " + error));

// Define user schema
const userSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  email: {
    type: String,
    unique: true,
  },
  password: String,
  confirmPassword: String,
  image: String,
});

const userModel = mongoose.model("account", userSchema);

// Define API endpoints
app.get("/", (req, res) => {
  res.send("Server is running");
});

app.get("/signup", (req, res) => {
  res.send("This is the signup page.");
});

app.post("/signup", (req, res) => {
  console.log(req.body);
  const { email } = req.body.email;
  // const foundUser =  userModel.findOne ({ "email" : req.body.email });
  userModel.findOne({ email: req.body.email })
    .then(result => {
      if (result) {
        // email already exists
        res.send({ message: "Email id is already register", alert: false });
      } else {
        // email not found, create new user
        // const data = userModel(req.body);
        // const save = data.save();
       // const data = userModel(req.body);
        //data.save();
        userModel.create({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          password: req.body.password,
          confirmPassword: req.body.confirmPassword,
          image: req.body.image
        }).then((user) => {
          res.send({ message: "Successfully sign up", alert: true });
        }).catch((err) => {
          return handleError(res, err);
        })
        res.send({ message: "Successfully sign up", alert: true });
      }
    })
    .catch(err => {
      // handle any errors
      console.log(err);
      res.status(500).send({ message: "Internal Server Error" });
    });
});


// Start the server
app.listen(PORT, () => console.log("Server is running at port: " + PORT));