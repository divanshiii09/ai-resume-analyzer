require("dotenv").config();

const connectDB = require("./config/db");
const User = require("./models/User");
const Resume = require("./models/Resume");
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const upload = require("./middleware/upload");
const app = express();

connectDB();

app.use(cors());
app.use(express.json());

const path = require("path");

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

/* ---------------- REGISTER ---------------- */

app.post("/api/register", async (req, res) => {
console.log("REGISTER HIT");
console.log(req.body);
  try {
const { name, email, password } = req.body;


const existingUser = await User.findOne({
  email,
});

if (existingUser) {
  return res.status(400).json({
    message: "User already exists",
  });
}

const hashedPassword = await bcrypt.hash(
  password,
  10
);

const newUser = await User.create({
  name,
  email,
  password: hashedPassword,
});

res.json({
  message: "User registered successfully",
  user: {
    name: newUser.name,
    email: newUser.email,
  },
});


} catch (error) {
  console.log("REGISTER ERROR");
  console.log(error);

  res.status(500).json({
    message: error.message,
});


}
});

/* ---------------- LOGIN ---------------- */

app.post("/api/login", async (req, res) => {
try {
const { email, password } = req.body;


const user = await User.findOne({
  email,
});

if (!user) {
  return res.status(400).json({
    message: "User not found",
  });
}

const isMatch = await bcrypt.compare(
  password,
  user.password
);

if (!isMatch) {
  return res.status(400).json({
    message: "Invalid password",
  });
}

const token = jwt.sign(
  {
    email: user.email,
    name: user.name,
  },
  "secretkey123",
  {
    expiresIn: "1h",
  }
);

res.json({
  message: "Login successful",
  token,
  user: {
    name: user.name,
    email: user.email,
  },
});


} catch (error) {
console.log(error);


res.status(500).json({
  message: "Server error",
});

}
});

// ---------------- SAVE RESUME ---------------- */
app.post(
"/api/resume",
upload.single("resume"),
async (req, res) => {
try {
const { userEmail,
atsScore,
} = req.body;


  const resume =
    await Resume.create({
      title: req.file.originalname,

      fileName:
        req.file.originalname,

      filePath:
        req.file.path,

      userEmail,

      atsScore,
    });

  res.json({
    message:
      "Resume uploaded successfully",

    resume,
  });
} catch (error) {
  console.log(error);

  res.status(500).json({
    message: "Server error",
  });
}

}
);

/* ---------------- TEST ROUTE ---------------- */

app.get("/api/test", (req, res) => {
res.json({
message: "Backend working",
});
});

// ---------------- GET RESUMES ---------------- */
app.get("/api/resumes/:email", async (req, res) => {
try {
const resumes = await Resume.find({
userEmail: req.params.email,
}).sort({ createdAt: -1 });


res.json(resumes);

} catch (error) {
console.log(error);


res.status(500).json({
  message: "Server error",
});


}
});


/* ---------------- START SERVER ---------------- */

app.listen(3000, () => {
console.log(
"Server running on port 3000"
);
});

// ---------------- GET RESUME BY ID ---------------- */
app.get("/api/resume/:id", async (req, res) => {
try {
const resume =
await Resume.findById(
req.params.id
);


res.json(resume);


} catch (error) {
console.log(error);


res.status(500).json({
  message: "Server error",
});


}
});

// ---------------- GET LATEST RESUME BY EMAIL ---------------- */
app.get(
"/api/resume/latest/:email",
async (req, res) => {
try {
const resume =
await Resume.findOne({
userEmail:
req.params.email,
}).sort({
createdAt: -1,
});


  res.json(resume);
} catch (error) {
  console.log(error);

  res.status(500).json({
    message: "Server error",
  });
}

}
);
