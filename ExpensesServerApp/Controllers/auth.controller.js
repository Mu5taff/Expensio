import AuthService from "../services/auth.service.js";
import jwt from "jsonwebtoken";
const REFRESH_TOKEN_SECRET =
  process.env.REFRESH_TOKEN_SECRET || "your-refresh-secret";

class AuthController {
  async register(req, res) {
    try {
      const { username, email, password } = req.body;

      if (!username || !password || !email) {
        return res
          .status(400)
          .json({ message: "Username and password are required" });
      }

      const { accessToken, refreshToken } = await AuthService.register(
        username,
        email,
        password
      );

      // Store refresh token in HTTP-only cookie
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.status(201).json({ accessToken });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async login(req, res) {
    const { email, password } = req.body;

    try {
      const { accessToken, refreshToken } = await AuthService.login(
        email,
        password
      );

      // Store refresh token in HTTP-only cookie
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true, // Use in production with HTTPS
        sameSite: "Strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.json({ accessToken });
    } catch (error) {
      res.status(401).json({ message: error.message });
    }
  }

  async refresh(req, res) {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken)
        return res.status(403).json({ message: "Refresh token required" });

      const user = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
      const newAccessToken = AuthService.generateAccessToken({ id: user.id });

      res.json({ accessToken: newAccessToken });
    } catch (error) {
      res.status(403).json({ message: error.message });
    }
  }

  async logout(req, res) {
    res.clearCookie("refreshToken");
    res.json({ message: "Logged out" });
  }
}

export default new AuthController();
