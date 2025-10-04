import mongoose from "mongoose";
import app from "./app.js";
import { startReminderScheduler } from "./services/cron.scheduler.js";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(process.env.MONGODB_URL);
    console.log("Database connected successfully");
    console.log("Host:", connectionInstance.connection.host);
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
};

const start = async () => {
  await connectDB();
  const port = Number(process.env.PORT) || 3000;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    
    // Start the reminder scheduler
    startReminderScheduler();
  });
};

start();
