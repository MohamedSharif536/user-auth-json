const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const usersFile = path.join(__dirname, "../data/users.json");

function readUsers() {
  if (!fs.existsSync(usersFile)) return [];
  const data = fs.readFileSync(usersFile, "utf-8");
  return JSON.parse(data || "[]");
}

function writeUsers(users) {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

// REGISTER
exports.registerUser = (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ message: "All fields are required" });

  const users = readUsers();

  const existingUser = users.find(u => u.email === email);
  if (existingUser)
    return res.status(400).json({ message: "User already exists" });

  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser = {
    id: Date.now(),
    name,
    email,
    password: hashedPassword,
  };

  users.push(newUser);
  writeUsers(users);

  res.status(201).json({ message: "User registered successfully", user: newUser });
};

// LOGIN
exports.loginUser = (req, res) => {
  const { email, password } = req.body;
  const users = readUsers();

  const user = users.find(u => u.email === email);
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  const isMatch = bcrypt.compareSync(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  res.json({ message: "Login successful", token });
};
