import { Schema, model } from 'mongoose';

const activitySchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    team: { type: Schema.Types.ObjectId, ref: 'Team', required: true },
    activityType: {
      type: String,
      enum: ['running', 'cycling', 'walking', 'strength'],
      required: true,
    },
    durationMinutes: { type: Number, min: 1, required: true },
    calories: { type: Number, min: 0, required: true },
    date: { type: Date, required: true },
  },
  { timestamps: true },
);

activitySchema.index(
  { user: 1, activityType: 1, date: 1 },
  { unique: true },
);

export default model('Activity', activitySchema);
