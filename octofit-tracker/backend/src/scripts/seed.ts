import mongoose from 'mongoose';
import Activity from '../models/Activity.js';
import Leaderboard from '../models/Leaderboard.js';
import Team from '../models/Team.js';
import User from '../models/User.js';
import Workout from '../models/Workout.js';

const connectionString =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';

/**
 * Seed the octofit_db database with test data
 */
async function seedDatabase() {
  try {
    await mongoose.connect(connectionString);
    console.log('Connected to octofit_db');

    async function seedUser(data: {
      email: string;
      name: string;
      username: string;
    }) {
      const user = await User.findOne({ email: data.email });
      if (!user) {
        return User.create(data);
      }

      user.set(data);
      return user.save();
    }

    const users = await Promise.all([
      seedUser({
        email: 'ava.morgan@example.com',
        name: 'Ava Morgan',
        username: 'avamoves',
      }),
      seedUser({
        email: 'liam.chen@example.com',
        name: 'Liam Chen',
        username: 'liamruns',
      }),
      seedUser({
        email: 'sofia.rivera@example.com',
        name: 'Sofia Rivera',
        username: 'sofiastrong',
      }),
    ]);

    async function seedTeam(data: {
      name: string;
      description: string;
      members: mongoose.Types.ObjectId[];
    }) {
      const team = await Team.findOne({ name: data.name });
      if (!team) {
        return Team.create(data);
      }

      team.set(data);
      return team.save();
    }

    const teams = await Promise.all([
      seedTeam({
        name: 'Trail Blazers',
        description: 'A team focused on steady miles and outdoor adventures.',
        members: [users[0]._id, users[1]._id],
      }),
      seedTeam({
        name: 'Strength Squad',
        description: 'A supportive crew building strength one session at a time.',
        members: [users[2]._id],
      }),
    ]);

    await Promise.all([
      ...users.slice(0, 2).map((user) =>
        User.updateOne({ _id: user._id }, { $set: { team: teams[0]._id } }),
      ),
      User.updateOne(
        { _id: users[2]._id },
        { $set: { team: teams[1]._id } },
      ),
    ]);

    const activitySamples = [
      {
        user: users[0],
        team: teams[0],
        activityType: 'running',
        durationMinutes: 32,
        calories: 310,
        date: new Date('2026-10-01T07:30:00Z'),
      },
      {
        user: users[1],
        team: teams[0],
        activityType: 'cycling',
        durationMinutes: 45,
        calories: 420,
        date: new Date('2026-10-02T17:00:00Z'),
      },
      {
        user: users[2],
        team: teams[1],
        activityType: 'strength',
        durationMinutes: 40,
        calories: 280,
        date: new Date('2026-10-03T16:15:00Z'),
      },
      {
        user: users[0],
        team: teams[0],
        activityType: 'walking',
        durationMinutes: 25,
        calories: 115,
        date: new Date('2026-10-04T09:00:00Z'),
      },
    ] as const;

    await Promise.all(
      activitySamples.map(async ({ user, team, ...activity }) => {
        const data = { ...activity, user: user._id, team: team._id };
        const existing = await Activity.findOne({
          user: user._id,
          activityType: activity.activityType,
          date: activity.date,
        });
        if (!existing) {
          return Activity.create(data);
        }

        existing.set(data);
        return existing.save();
      }),
    );

    const periodStart = new Date('2026-10-01T00:00:00Z');
    const standings = [
      { user: users[0], team: teams[0], points: 820, activitiesCount: 2 },
      { user: users[1], team: teams[0], points: 670, activitiesCount: 1 },
      { user: users[2], team: teams[1], points: 590, activitiesCount: 1 },
    ];
    await Promise.all(
      standings.map(async ({ user, team, ...standing }) => {
        const data = { ...standing, user: user._id, team: team._id, periodStart };
        const existing = await Leaderboard.findOne({ user: user._id, periodStart });
        if (!existing) {
          return Leaderboard.create(data);
        }

        existing.set(data);
        return existing.save();
      }),
    );

    const workouts = [
      {
        name: 'Easy 5K Builder',
        description:
          'A conversational-pace run with a gentle warm-up and cool-down.',
        category: 'cardio',
        difficulty: 'beginner',
        durationMinutes: 35,
        exercises: [
          { name: 'Easy run', durationMinutes: 25 },
          { name: 'Warm-up and cool-down', durationMinutes: 10 },
        ],
      },
      {
        name: 'Full-Body Basics',
        description:
          'A balanced introduction to foundational strength movements.',
        category: 'strength',
        difficulty: 'beginner',
        durationMinutes: 30,
        exercises: [
          { name: 'Bodyweight squats', sets: 3, reps: 10 },
          { name: 'Incline push-ups', sets: 3, reps: 8 },
          { name: 'Glute bridges', sets: 3, reps: 12 },
        ],
      },
      {
        name: 'Recovery Flow',
        description: 'Gentle mobility work to support recovery after training.',
        category: 'recovery',
        difficulty: 'beginner',
        durationMinutes: 20,
        exercises: [
          { name: 'Hip mobility', durationMinutes: 8 },
          { name: 'Shoulder mobility', durationMinutes: 6 },
          { name: 'Breathing and stretch', durationMinutes: 6 },
        ],
      },
    ] as const;

    await Promise.all(
      workouts.map(async (workout) => {
        const existing = await Workout.findOne({ name: workout.name });
        if (!existing) {
          return Workout.create({
            ...workout,
            exercises: [...workout.exercises],
          });
        }

        existing.set(workout);
        return existing.save();
      }),
    );

    console.log('Database seeding complete');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exitCode = 1;
  } finally {
    try {
      await mongoose.disconnect();
    } catch (error) {
      console.error('Error disconnecting from octofit_db:', error);
      process.exitCode = 1;
    }
  }
}

void seedDatabase();
