import mongoose from 'mongoose';
import User from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/blog-app';

async function makeAdmin() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Update user with email to admin role
    const email = 'blog@gmail.com';  // Change this to your email
    const result = await User.updateOne(
      { email },
      { $set: { role: 'admin' } }
    );

    if (result.matchedCount > 0) {
      console.log(`✅ Successfully made ${email} an admin!`);
      
      // Verify the update
      const user = await User.findOne({ email });
      console.log(`User role: ${user.role}`);
    } else {
      console.log(`❌ No user found with email: ${email}`);
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

makeAdmin();
