import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function test() {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log("DB_SUCCESS");
    process.exit(0);
  } catch (err) {
    console.error("DB_ERROR:", err);
    process.exit(1);
  }
}
test();
