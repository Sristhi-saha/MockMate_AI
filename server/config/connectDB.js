import mongoose from "mongoose";
// for the dns we need to add the following two line
import dns from "dns";
dns.setServers(["1.1.1.1","8.8.8.8"]);

const connectDB = async () => {
  try {

    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);

  } catch (error) {
    console.error("MongoDB Connection Failed:", error);
    process.exit(1);
  }
};

export default connectDB;