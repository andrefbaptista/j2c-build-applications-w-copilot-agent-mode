import { Schema, model } from 'mongoose';

const leaderboardSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    team: { type: Schema.Types.ObjectId, ref: 'Team', required: true },
    points: { type: Number, min: 0, required: true },
    activitiesCount: { type: Number, min: 0, required: true },
    periodStart: { type: Date, required: true },
  },
  { timestamps: true },
);

leaderboardSchema.index({ user: 1, periodStart: 1 }, { unique: true });

export default model('Leaderboard', leaderboardSchema);
