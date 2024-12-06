// accessToken = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImZ1bGxOYW1lIjoiS3VzaGFsIiwiZW1haWwiOiJrdXNoYWxAZ21pbC5jb20iLCJwYXNzd29yZCI6IjEyMzQ1IiwiY3JlYXRlT24iOiIyMDI0LTA2LTA1VDEzOjI4OjA5LjAxMFoiLCJfaWQiOiI2NjYwNjg4YWNkZDU0NWVjZTMzZjFiMDUiLCJfX3YiOjB9LCJpYXQiOjE3MTc1OTQyNTAsImV4cCI6MTcxNzgxMDI1MH0.B3BOKv3NRVau4Tvc9T5kGRa4rmUzr0d3tJkAkrjnkCg

require("dotenv").config();

const express = require('express');
const config = require("./config.json");
const mongoose = require('mongoose');
mongoose.connect(config.connectionString);

const User = require("./models/user.model");
const Note = require("./models/note.model");

const cors = require('cors');
const jwt = require('jsonwebtoken');
const { authenticateToken } = require('./utilities');
const app = express();

app.use(express.json());

app.use(
    cors({
        origin: "*"
    })
);

app.get("/", (req, res) => {
    res.json({ data: "hello" });
});

// Create Account
app.post("/create-account", async(req, res) => {
    const { fullName, email, password } = req.body;

    if (!fullName) {
        return res
            .status(400)
            .json({ error: true, message: "Fullname is required" });
    }

    if (!email) {
        return res
            .status(400)
            .json({ error: true, message: "Email is required" });
    }

    if (!password) {
        return res
            .status(400)
            .json({ error: true, message: "Password is required" });
    }

    const isUser = await User.findOne({ email: email });

    if (isUser) {
        return res.json({
            error: true,
            message: "User already exists",
        });
    }

    const user = new User({
        fullName,
        email,
        password,
    });

    await user.save();

    const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1h",
    });

    return res.json({
        error: false,
        user,
        accessToken,
        message: "Registration successful"
    });
});

app.post("/login", async(req, res) => {
    const { email, password } = req.body;

    if (!email) {
        return res
            .status(400)
            .json({ error: true, message: "Email is required" });
    };

    if (!password) {
        return res
            .status(400)
            .json({ error: true, message: "Password is required" });
    }

    const userInfo = await User.findOne({ email: email });
    if (!userInfo) {
        return res
            .status(400)
            .json({ error: true, message: "User not Found" });
    };

    if (userInfo.email === email && userInfo.password === password) {
        const user = { user: userInfo };

        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: "10h" // Corrected the typo here
        });

        return res.json({
            error: false,
            message: "Login Successful",
            email,
            accessToken
        });
    } else {
        return res.status(400).json({
            error: true,
            message: "Invalid Username or Password!!",
        })
    }
});

app.get("/get-user", authenticateToken, async(req, res) => {
    const { user } = req.user;

    const isUser = await User.findById(user._id);

    if (!isUser) {
        return res.status(401).json({ error: true, message: "User not found" });
    }

    return res.json({ error: false, user: isUser, message: "" });
});


app.post("/add-note", authenticateToken, async(req, res) => {
    const { title, content, tags } = req.body;
    const { user } = req.user;

    if (!title) {
        return res.status(400).json({
            error: true,
            message: "Title is Required!!"
        });
    };

    if (!content) {
        return res.status(400).json({
            error: true,
            message: "Content is Required!!"
        });
    };

    try {
        const note = new Note({
            title,
            content,
            tags: tags || [],
            userId: user._id,
        });
        await note.save();

        return res.json({
            error: false,
            note,
            message: "Note is Add Successfully!!"
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Internal Server Error"
        });
    }
});

app.put("/edit-note/:noteId", authenticateToken, async(req, res) => {
    const noteId = req.params.noteId;
    const { title, content, tags, isPinned } = req.body;
    const { user } = req.user;

    if (!title && !content && !tags && isPinned === undefined) {
        return res.status(400).json({
            error: true,
            message: "No Changes Provided!",
        });
    }

    try {
        const note = await Note.findOne({ _id: noteId, userId: user._id });

        if (!note) {
            return res.status(404).json({
                error: true,
                message: "Note not Found!",
            });
        }

        if (title) note.title = title;
        if (content) note.content = content;
        if (tags) note.tags = tags;
        if (isPinned !== undefined) note.isPinned = isPinned;

        await note.save();

        return res.json({
            error: false,
            note,
            message: "Note updated Successfully.",
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Internal Server Error!",
        });
    }
});

app.put("/update-note-pinned/:noteId", authenticateToken, async(req, res) => {
    const noteId = req.params.noteId;
    const { isPinned } = req.body;
    const { user } = req.user;

    if (!isPinned) {
        return res.status(400).json({
            error: true,
            message: "No Changes Provided!",
        });
    }

    try {
        const note = await Note.findOne({ _id: noteId, userId: user._id });

        if (!note) {
            return res.status(404).json({
                error: true,
                message: "Note not Found!",
            });
        }
        if (isPinned !== undefined || false) note.isPinned = isPinned || false;

        await note.save();

        return res.json({
            error: false,
            note,
            message: "Note updated Successfully.",
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Internal Server Error!",
        });
    }
});

app.get("/get-all-notes", authenticateToken, async(req, res) => {
    const { user } = req.user;

    try {
        const notes = await Note.find({ userId: user._id }).sort({
            isPinned: -1,
        });

        return res.json({
            error: false,
            notes,
            message: "All Notes Retrieved Successfully!",
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Internal Server Error",
        });
    }
});

app.delete("/delete-note/:noteId", authenticateToken, async(req, res) => {
    const noteId = req.params.noteId;
    const { user } = req.user;

    try {
        const note = await Note.findOne({ _id: noteId, userId: user._id });

        if (!note) {
            return res.status(404).json({
                error: true,
                message: "Note not Found!!"
            });
        }

        await Note.deleteOne({ _id: noteId, userId: user._id });

        return res.json({
            error: false,
            message: "Note Delete Successfully!!",
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Internal Server Error",
        })
    }
});

app.get("/search-note", authenticateToken, async(req, res) => {
    const { user } = req.user;
    const { query } = req.query;

    if (!query) {
        return res.status(400)
            .json({
                error: true,
                message: "Search query is Required"
            })
    }

    try {
        const matchingNote = await Note.find({
            userId: user._id,
            $or: [
                { title: { $regex: new RegExp(query, "i") } },
                { content: { $regex: new RegExp(query, "i") } }
            ],
        });

        return res.json({
            error: false,
            note: matchingNote,
            message: "Notes matching the search quary retrive successfully!!",
        });

    } catch (error) {
        return res
            .status(500)
            .json({
                error: true,
                message: "Internal Server Error!!",
            });
    }
});

app.listen(8000);

module.exports = app;