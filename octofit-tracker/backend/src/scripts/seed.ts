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

    const users = await Promise.all([
      User.findOneAndUpdate(
        { email: 'ava.morgan@example.com' },
        { $set: { name: 'Ava Morgan', username: 'avamoves' } },
        { upsert: true, returnDocument: 'after', runValidators: true },
      ),
      User.findOneAndUpdate(
        { email: 'liam.chen@example.com' },
        { $set: { name: 'Liam Chen', username: 'liamruns' } },
        { upsert: true, returnDocument: 'after', runValidators: true },
      ),
      User.findOneAndUpdate(
        { email: 'sofia.rivera@example.com' },
        { $set: { name: 'Sofia Rivera', username: 'sofiastrong' } },
        { upsert: true, returnDocument: 'after', runValidators: true },
      ),
    ]);

    const teams = await Promise.all([
      Team.findOneAndUpdate(
        { name: 'Trail Blazers' },
        {
          $set: {
            description: 'A team focused on steady miles and outdoor adventures.',
            members: [users[0]._id, users[1]._id],
          },
        },
        { upsert: true, returnDocument: 'after', runValidators: true },
      ),
      Team.findOneAndUpdate(
        { name: 'Strength Squad' },
        {
          $set: {
            description: 'A supportive crew building strength one session at a time.',
            members: [users[2]._id],
          },
        },
        { upsert: true, returnDocument: 'after', runValidators: true },
      ),
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
      activitySamples.map(({ user, team, ...activity }) =>
        Activity.findOneAndUpdate(
          {
            user: user._id,
            activityType: activity.activityType,
            date: activity.date,
          },
          { $set: { ...activity, user: user._id, team: team._id } },
          { upsert: true, returnDocument: 'after', runValidators: true },
        ),
      ),
    );

    const periodStart = new Date('2026-10-01T00:00:00Z');
    const standings = [
      { user: users[0], team: teams[0], points: 820, activitiesCount: 2 },
      { user: users[1], team: teams[0], points: 670, activitiesCount: 1 },
      { user: users[2], team: teams[1], points: 590, activitiesCount: 1 },
    ];
    await Promise.all(
      standings.map(({ user, team, ...standing }) =>
        Leaderboard.findOneAndUpdate(
          { user: user._id, periodStart },
          { $set: { ...standing, user: user._id, team: team._id } },
          { upsert: true, returnDocument: 'after', runValidators: true },
        ),
      ),
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
      workouts.map((workout) =>
        Workout.findOneAndUpdate(
          { name: workout.name },
          { $set: workout },
          { upsert: true, returnDocument: 'after', runValidators: true },
        ),
      ),
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
