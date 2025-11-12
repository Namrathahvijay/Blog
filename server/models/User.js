import mongoose from "mongoose";
import bcrypt from "bcryptjs";


const userSchema = new mongoose.Schema(
  {
    name: String,
    firstName: String,
    lastName: String,
    username: { type: String, unique: true, sparse: true },
    email: { type: String, required: true, unique: true },
    password: String,
    avatarUrl: String,
    bio: String,
    place: String,
    info: String,
    dateOfBirth: Date,
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    suspended: { type: Boolean, default: false },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    isGoogleUser: { type: Boolean, default: false }
  },
  { timestamps: true }
);



// Hash password before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);
