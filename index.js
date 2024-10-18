const express = require('express');
const Blog = require('./app/models/blogs.model');
const mongoose = require("mongoose");
const cors = require('cors');
const nodemailer = require('nodemailer');
const app = express();

app.use(express.json());
require('dotenv').config();
app.use(cors());

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(() => console.log('Connected to MongoDB: Personal_Website'))
    .catch((error) => console.error('Failed to connect to MongoDB:', error));

app.get('/blogs', async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ dateCreated: -1 }); 
        res.status(200).json(blogs);
    } catch (err) {
        res.status(500).json({ message: "Error fetching blogs", error: err.message });
    }
});

app.post('/create-blog', async (req, res) => {
    const { title, content, author, images, isPublished } = req.body;  

    // Validate required fields
    if (!title || !content || !author) {
        return res.status(400).json({ message: "Title, content, and author are required." });
    }

    try {
        const newBlog = new Blog({
            title,
            content,
            author,
            images,
            isPublished,
            dateCreated: new Date(), 
        });

        const savedBlog = await newBlog.save();
        res.status(201).json(savedBlog); 
    } catch (err) {
        res.status(500).json({ message: "Error creating blog", error: err.message });
    }
});


app.get('/', (req, res) => {
  res.send('Hello, Node.js backend!');
});

// Recieve email json from frontend to run nodmailer and send to luckystrikesbowling2@gmail.com
app.post('/send-email', (req, res) => {
    const { name, email, message } = req.body;

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'luckystrikesbowling2@gmail.com', 
            pass: 'wrgf jhcn jqjo kkue', 
        },
    });

    const mailOptions = {
        from: email,  
        to: "luckystrikesbowling2@gmail.com",  
        subject: `Message from ${name}`,  
        text: `You have received a message from ${name}.\n\nMessage: ${message}\n\nContact Email: ${email}`, 
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            return res.status(500).json({ message: 'Error sending email', error });
        } else {
            console.log("Email sent:", info);
            return res.status(200).json({ message: 'Email sent successfully', info });
        }
    });
});


app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});