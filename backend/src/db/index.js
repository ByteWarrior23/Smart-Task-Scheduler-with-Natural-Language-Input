import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const options = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferCommands: false,
    };

    await mongoose.connect(process.env.MONGODB_URL, options);
    
    // Connection event handlers
    mongoose.connection.on('connected', () => {
      console.log("Database connected successfully!");
    });

    mongoose.connection.on('error', (err) => {
      console.error("Database connection error:", err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log("Database disconnected");
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log("Database connection closed through app termination");
      process.exit(0);
    });

  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
};

export default connectDB;
