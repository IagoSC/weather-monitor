import { KafkaMessage } from "kafkajs";
import { Consumer } from "./Consumer";

console.log("Starting Consumer...");

export type Time = "morning" | "noom" | "evening" | "night";

export type ReceivedMessage = {
    topic: string;
    partition: Number;
    message: KafkaMessage;
};

const runConsumer = async (topic: string, id: number) => {
    const consumer = new Consumer(`tester-${id}`);
    consumer.subscribe(topic);
    consumer.run();
};

["noom", "night"].map((topic, id) => {
    runConsumer(topic, id);
});
