import { run, submit } from "../controllers/submission.js";
import express from "express";
const router = express.Router();

router.post("/run", run);
router.post("/submit",submit)
export default router;