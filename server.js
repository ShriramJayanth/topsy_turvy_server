import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import cors from "cors";
import submissionRoutes from "./routes/submission.js";
import authRoutes from "./routes/auth.js";

const app = express();
const PORT = 3001;
dotenv.config();

app.use(express.json());
app.use(cors());

app.use("/code", submissionRoutes);
app.use("/auth",authRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
