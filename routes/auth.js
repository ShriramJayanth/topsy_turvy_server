import express from "express";
import { verifyToken,login,addUser, getLogs, getUsers } from "../controllers/auth.js";

const router = express.Router();

router.get("/protected", verifyToken, (req, res) => {
  res.json({ message: "This is protected data", user: req.user });
});
router.post("/adduser",addUser);
router.post("/login",login);
router.get("/logs",getLogs);
router.get("/users",getUsers)

export default router;
