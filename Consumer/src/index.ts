import { Kafka } from "kafkajs";
import { config } from "../config";

console.log("Starting Consumer...");

const kafka = new Kafka({ brokers: [config.brokers] });
kafka.producer();
