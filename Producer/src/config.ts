import env from "dotenv";
env.config();

export const config = {
    brokers: process.env.BROKER_ADDR || "localhost",
};
