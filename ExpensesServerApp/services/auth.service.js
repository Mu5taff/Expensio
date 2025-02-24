import UserRepository from "../repositories/user.repository.js";
import jwt from "jsonwebtoken";
import "dotenv/config";
import bcrypt from "bcrypt";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

class AuthService {
  generateAccessToken(user) {
    return jwt.sign({ id: user.id }, ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
  }

  generateRefreshToken(user) {
    return jwt.sign({ id: user.id }, REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
  }

  async register(username, email, password) {
    console.log("🟢 Registering user:", { username, email, password }); // ✅ Debug Log

    // Check if user already exists
    const existingUser = await UserRepository.findByEmail(email);
    if (existingUser) {
      console.log("🔴 Email already exists!");
      throw new Error("Email is already registered");
    }

    //  Ensure password is provided
    if (!password) {
      throw new Error("Password is required");
    }

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("🟢 Password hashed successfully");

    //  Fix: Pass correct parameters to `createUser`
    const newUser = await UserRepository.createUser(
      username,
      email,
      hashedPassword
    );

    console.log(" User created:", newUser);

    // Generate tokens for the newly registered user
    const accessToken = this.generateAccessToken(newUser);
    const refreshToken = this.generateRefreshToken(newUser);

    console.log(" Tokens generated successfully");

    return { accessToken, refreshToken };
  }

  async login(email, password) {
    console.log(" Attempting login:", email);

    // User checks
    const user = await UserRepository.findByEmail(email);
    if (!user) {
      console.log(" Invalid credentials: User not found");
      throw new Error("Invalid credentials");
    }

    // Password Checks
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      console.log(" Invalid credentials: Password incorrect");
      throw new Error("Invalid credentials");
    }

    // Generate Access Tokens for authMiddleware
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    console.log("🟢 Login successful. Tokens generated.");

    return { accessToken, refreshToken };
  }
}

export default new AuthService();
