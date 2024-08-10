import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  name: { type: String, required: false }, 
  email: { type: String, required: true, unique: true },
  password: { type: String },
  githubId: { type: String },
  role: { type: String, enum: ['usuario', 'admin'], default: 'usuario' },
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date }
});

userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export const UserModel = mongoose.model('User', userSchema);