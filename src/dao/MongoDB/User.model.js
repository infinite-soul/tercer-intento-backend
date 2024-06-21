import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  githubId: { type: String },
  role: { type: String, default: 'usuario' }
});

export const UserModel = mongoose.model('User', userSchema);