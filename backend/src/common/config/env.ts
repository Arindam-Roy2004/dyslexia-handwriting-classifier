import dotenv from "dotenv";

dotenv.config();

export const ENV = {
  PORT: process.env.PORT || 5001,
  NODE_ENV: process.env.NODE_ENV || "development",
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:3000",
  MAX_FILE_SIZE_MB: Number(process.env.MAX_FILE_SIZE_MB) || 10,
};

export default ENV;
