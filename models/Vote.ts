import mongoose, { Document, Schema } from 'mongoose';

export interface IVote extends Document {
  voterId: mongoose.Types.ObjectId;
  candidateId: mongoose.Types.ObjectId;
  electionId: mongoose.Types.ObjectId;
  position: string;
  timestamp: Date;
}

const VoteSchema = new Schema<IVote>({
  voterId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  candidateId: { type: Schema.Types.ObjectId, ref: 'Candidate', required: true },
  electionId: { type: Schema.Types.ObjectId, ref: 'Election', required: true },
  position: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

VoteSchema.index({ voterId: 1, electionId: 1, position: 1 }, { unique: true });

export default mongoose.models.Vote || mongoose.model<IVote>('Vote', VoteSchema);