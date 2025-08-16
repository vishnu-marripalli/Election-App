import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  studentId: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'candidate' | 'voter';
  class: string;
  section?: string;
  photo?: string;
  isApproved: boolean;
  hasVoted: { [key: string]: boolean };
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>({
  studentId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'candidate', 'voter'], default: 'voter' },
  class: { type: String, required: true },
  section: { type: String },
  photo: { type: String },
  isApproved: { type: Boolean, default: false },
  hasVoted: { type: Map, of: Boolean, default: {} }
}, {
  timestamps: true
});

UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

UserSchema.methods.comparePassword = async function(candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);