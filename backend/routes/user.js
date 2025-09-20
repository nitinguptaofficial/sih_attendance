const router = require("express").Router();
const multer = require("multer");
const path = require("path");

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Register new user with face data
router.post("/register", upload.single("image"), async (req, res) => {
  try {
    const { name, email, faceDescriptor, role } = req.body;
    
    let parsedFaceDescriptor;
    try {
      parsedFaceDescriptor =
        typeof faceDescriptor === "string"
          ? JSON.parse(faceDescriptor)
          : faceDescriptor;
    } catch (e) {
      console.error("Error parsing face descriptor:", e);
      parsedFaceDescriptor = faceDescriptor;
    }

    const user = await req.prisma.user.create({
      data: {
        name,
        email,
        faceDescriptor: parsedFaceDescriptor,
        role: role.toUpperCase(),
      },
    });

    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all users
router.get("/", async (req, res) => {
  try {
    const users = await req.prisma.user.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
