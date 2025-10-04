import app from "./app.js";
import { connectDB } from "./db/index.js";
import { startReminderScheduler } from "./services/cron.scheduler.js";

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
