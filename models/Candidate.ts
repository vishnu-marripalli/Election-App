import mongoose, { Document, Schema } from 'mongoose';

export interface ICandidate extends Document {
  userId: mongoose.Types.ObjectId;
  electionId: mongoose.Types.ObjectId;
  position: string;
  motto: string;
  manifesto: string;
  photo?: string;
  isApproved: boolean;
  approvedBy?: mongoose.Types.ObjectId;
  votes: number;
}

const CandidateSchema = new Schema<ICandidate>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  electionId: { type: Schema.Types.ObjectId, ref: 'Election', required: true },
  position: { type: String, required: true },
  motto: { type: String, required: true },
  manifesto: { type: String, required: true },
  photo: { type: String },
  isApproved: { type: Boolean, default: false },
  approvedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  votes: { type: Number, default: 0 }
}, {
  timestamps: true
});

CandidateSchema.index({ userId: 1, electionId: 1, position: 1 }, { unique: true });

export default mongoose.models.Candidate || mongoose.model<ICandidate>('Candidate', CandidateSchema);