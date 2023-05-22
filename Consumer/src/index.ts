import { KafkaMessage } from "kafkajs";
import { Consumer } from "./Consumer";
import { Local } from "./consumerTypes";

console.log("Starting Consumer...");

export type Time = "morning" | "midday" | "evening" | "night";

export type ReceivedMessage = {
    topic: string;
    message: KafkaMessage;
};

const runConsumer = async (topic: Local) => {
    const consumer = new Consumer();
    consumer.subscribe(topic);
    consumer.run();
};

(["camburi", "barrote"] as Local[]).map((topic) => {
    runConsumer(topic);
});
