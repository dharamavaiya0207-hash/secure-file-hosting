require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const fs = require('fs');

const app = express();

app.use(express.json());
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.options('*', cors());

app.use('/uploads', express.static('uploads'));

// ================= DATABASE =================
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));

// ================= MODELS =================
const userSchema = new mongoose.Schema({
    username: String,
    email: { type: String, unique: true },
    password: String,
    created_at: { type: Date, default: Date.now }
});
const User = mongoose.model('User', userSchema);

const fileSchema = new mongoose.Schema({
    filename: String,
    path: String,
    size: Number,
    uploaded_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    uploaded_at: { type: Date, default: Date.now }
});
const File = mongoose.model('File', fileSchema);

// ================= AUTH =================
const auth = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ msg: 'No token' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch {
        res.status(401).json({ msg: 'Invalid token' });
    }
};

// ================= MULTER =================
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({
    storage,
    limits: { fileSize: 20 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf' || file.mimetype === 'video/mp4') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF & MP4 allowed'));
        }
    }
});

// ================= ROUTES =================

// REGISTER
app.post('/api/register', async (req, res) => {
    const { username, email, password } = req.body;

    const exist = await User.findOne({ email });
    if (exist) return res.status(400).json({ msg: 'Email already exists' });

    const hash = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hash });

    await user.save();
    res.json({ msg: 'Registered successfully' });
});

// LOGIN
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'User not found' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ msg: 'Wrong password' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ token });
});

// UPLOAD
app.post('/api/upload', auth, upload.single('file'), async (req, res) => {
    const file = new File({
        filename: req.file.filename,
        path: req.file.path,
        size: req.file.size,
        uploaded_by: req.user.id
    });

    await file.save();
    res.json({ msg: 'File uploaded' });
});

// ALL FILES
app.get('/api/public-files', auth, async (req, res) => {
    const files = await File.find().populate('uploaded_by', 'email');
    res.json(files);
});

// MY FILES
app.get('/api/my-files', auth, async (req, res) => {
    const files = await File.find({ uploaded_by: req.user.id });
    res.json(files);
});

// DELETE
app.delete('/api/files/:id', auth, async (req, res) => {
    const file = await File.findById(req.params.id);

    if (!file) return res.status(404).json({ msg: 'Not found' });

    if (file.uploaded_by.toString() !== req.user.id)
        return res.status(403).json({ msg: 'Unauthorized' });

    fs.unlinkSync(file.path);
    await File.findByIdAndDelete(req.params.id);

    res.json({ msg: 'Deleted' });
});

// ================= START =================
app.listen(process.env.PORT, () =>
    console.log(`Server running on ${process.env.PORT}`)
);