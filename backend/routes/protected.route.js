import express from "express";
import verifyToken from "../middleware/authMiddleware.js";  // Note the .js extension for local modules

const router = express.Router();

router.get("/protected", verifyToken, (req, res) => {
  res.json({ message: "This is a protected route", user: req.user });
});

export default router;
