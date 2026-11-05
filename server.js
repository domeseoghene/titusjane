const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(cors({
    origin: [
        "http://localhost:5500",
        "http://127.0.0.1:5500"
    ]
}));

app.use(express.json());

const usersFile = path.join(__dirname, "users.json");

if (!fs.existsSync(usersFile)) {
    fs.writeFileSync(usersFile, "[]");
}

function getUsers() {
    return JSON.parse(fs.readFileSync(usersFile, "utf8"));
}

function saveUsers(users) {
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

// Test the backend
app.get("/", (req, res) => {
    res.send("Your registration backend is working!");
});

// Register a new user
app.post("/api/register", async (req, res) => {
    try {
        const {
            fullname,
            email,
            username,
            password,
            confirmPassword
        } = req.body;

        if (!fullname || !email || !username || !password || !confirmPassword) {
            return res.status(400).json({
                message: "Please fill in all fields."
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                message: "Passwords do not match."
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                message: "Password must have at least 8 characters."
            });
        }

        const users = getUsers();

        const existingUser = users.find(user =>
            user.email === email.trim().toLowerCase() ||
            user.username.toLowerCase() === username.trim().toLowerCase()
        );

        if (existingUser) {
            return res.status(409).json({
                message: "This email or username already exists."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = {
            id: Date.now().toString(),
            fullname: fullname.trim(),
            email: email.trim().toLowerCase(),
            username: username.trim(),
            password: hashedPassword
        };

        users.push(newUser);
        saveUsers(users);

        res.status(201).json({
            message: "Registration successful!",
            user: {
                fullname: newUser.fullname,
                email: newUser.email,
                username: newUser.username
            }
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error. Please try again."
        });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Backend running at http://localhost:${PORT}`);
});
// LOGIN ROUTE
app.post("/api/login", async (req, res) => {

    try {

        const { email, password } = req.body;

        // Check empty fields
        if (!email || !password) {
            return res.status(400).json({
                message: "Please enter your email and password."
            });
        }

        // Find the registered user
        const users = getUsers();

        const user = users.find(person =>
            person.email === email.trim().toLowerCase()
        );

        // Check if user exists
        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password."
            });
        }

        // Compare the password
        const passwordMatches = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatches) {
            return res.status(401).json({
                message: "Invalid email or password."
            });
        }

        // Successful login
        res.json({
            message: "Login successful!",

            user: {
                id: user.id,
                fullname: user.fullname,
                email: user.email,
                username: user.username
            }
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Something went wrong."
        });

    }

});