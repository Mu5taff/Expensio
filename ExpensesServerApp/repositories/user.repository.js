import User from "../models/user.model.js";

class UserRepository {
  async findByEmail(email) {
    return await User.findOne({ where: { email } }); // ✅ Fix query syntax
  }

  async createUser(username, email, hashedPassword) {
    return await User.create({
      // ✅ Pass values correctly
      username,
      email,
      password: hashedPassword,
    });
  }
}

export default new UserRepository();
