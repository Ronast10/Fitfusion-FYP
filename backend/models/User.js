const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // ADD THIS LINE
  avatar: { type: String, default: "avg1.png" }, 
  role: { type: String, default: "user" },
}, { timestamps: true });