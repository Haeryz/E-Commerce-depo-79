import jwt from "jsonwebtoken";

const verifyToken = async (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(403).json({ error: "Access denied" });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(verified.id); // Fetch user data
    if (!user) return res.status(404).json({ error: "User not found" });

    req.user = user; // Attach user data to the request
    next();
  } catch (err) {
    res.status(400).json({ error: "Invalid token" });
  }
};
export default verifyToken;
