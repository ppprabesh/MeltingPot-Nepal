import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword: string) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    console.error("Error comparing passwords:", error);
    return false;
  }
};

// Create the model
const UserModel = mongoose.models.User || mongoose.model("User", userSchema);

// Ensure the model has the comparePassword method
if (!UserModel.prototype.comparePassword) {
  UserModel.prototype.comparePassword = userSchema.methods.comparePassword;
}

export { UserModel };
export const User = UserModel;
