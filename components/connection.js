import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose
      .connect(process.env.MONGO_URI)
      .then(() => console.info("Connected with database successfully"));
  } catch (error) {
    console.error(
      "Some error occured while connecting with DB : " + error.message
    );
    process.exit(1);
  }
};
