const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const app = express();
app.use(cors());
app.use(express.json({limit: "10mb"}));

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

const userModel = mongoose.model("user", userSchema);

// Define API endpoints
app.get("/", (req, res) => {
    res.send("Server is running");
});

app.get("/signup", (req, res) => {
  res.send("This is the signup page.");
});

app.post("/signup", (req, res) => {
  console.log(req.body);
  const { email } = req.body;

  userModel.findOne({ email: email }, (err, result) => {
    console.log(result);
    console.log(err);
    if (result) {
      res.send({ message: "Email id is already register", alert: false });
    } else {
      const data = userModel(req.body);
      const save = data.save();
      res.send({ message: "Successfully sign up", alert: true });
    }
  });
});


// Start the server
app.listen(PORT, () => console.log("Server is running at port: " + PORT));