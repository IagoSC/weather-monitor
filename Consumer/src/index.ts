import { Kafka } from "kafkajs";
import { config } from "./config";

console.log("Starting Consumer...");

const kafka = new Kafka({ brokers: [config.brokers] });
const producer = kafka.producer();

producer.connect();

const num = Math.floor(Math.random() * 100);

producer.send({
    topic: "Numeros",
    messages: [{ key: "chave", value: `${num}` }],
});

producer.disconnect();