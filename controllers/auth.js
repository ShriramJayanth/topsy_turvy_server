import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const login=async (req, res) => {
  const { email, phoneNumber } = req.body;
  try {

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (user.phoneNumber !== phoneNumber) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, problemsSolved: user.problemsSolved },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const addUser = async (req, res) => {
  try {
    const { email, phoneNumber } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const existingPhone = await prisma.user.findUnique({ where: { phoneNumber } });
    if (existingPhone) {
      return res.status(400).json({ message: "Phone number already in use" });
    }

    const user = await prisma.user.create({
      data: {
        email,
        phoneNumber,
        problemsSolved: 0,
      },
    });

    res.status(201).json({ message: "User added successfully", user });
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers["authorization"];

    if (!token) {
      return res.status(403).json({ message: "No token provided" });
    }

    const decoded = await new Promise((resolve, reject) => {
      jwt.verify(token.split(" ")[1], process.env.SECRET_KEY, (err, decoded) => {
        if (err) reject(err);
        else resolve(decoded);
      });
    });

    const user = await prisma.user.findUnique({
      where: { email: decoded.email },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    decoded.problemsSolved = user.problemsSolved;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token", error: error.message });
  }
};

export const getLogs=async(req,res)=>{
  try{
    const logs = await prisma.log.findMany({
      orderBy: {
        timestamp: "desc",
      },
    });
    res.status(200).json({logs:logs});
  }
  catch(err){
    console.log(err);
    res.status(500).json({message:"server error"});
  }
}

