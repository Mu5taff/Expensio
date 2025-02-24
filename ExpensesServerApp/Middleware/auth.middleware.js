import jwt from "jsonwebtoken";

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("No token provided or malformed token");
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1]; // Get Rid of Bearer

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    if (!decoded.id) {
      console.log("Token missing user ID");
      return res.status(401).json({ message: "Invalid token" });
    }

    req.user = { id: decoded.id }; // Attach correct user ID to req.user
    console.log("Token verified for user ID:", decoded.id);

    next(); // ✅ Proceed to the next middleware/controller
  } catch (error) {
    console.error("Invalid token error:", error.message);
    return res.status(401).json({ message: "Invalid token" });
  }
};

export default authenticate;
