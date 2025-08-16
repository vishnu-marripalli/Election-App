import mongoose, { Document, Schema } from 'mongoose';

export interface IElection extends Document {
  title: string;
  description: string;
  positions: string[];
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  createdBy: mongoose.Types.ObjectId;
  eligibleClasses: string[];
}

const ElectionSchema = new Schema<IElection>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  positions: [{ type: String, required: true }],
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  isActive: { type: Boolean, default: false },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  eligibleClasses: [{ type: String, required: true }]
}, {
  timestamps: true
});

export default mongoose.models.Election || mongoose.model<IElection>('Election', ElectionSchema);