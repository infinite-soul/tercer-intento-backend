import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  name: { type: String, required: false },
  email: { type: String, required: true, unique: true },
  documents: [{
    name: String,
    reference: String
  }],
  last_connection: Date,
  password: { type: String },
  githubId: { type: String },
  role: { type: String, enum: ['usuario', 'admin', 'premium'], default: 'usuario' },
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date },
  passwordResetToken: String,
  passwordResetExpires: Date,
  resetPasswordToken: String,
  resetPasswordExpires: Date
});

export const UserModel = mongoose.model('User', userSchema);