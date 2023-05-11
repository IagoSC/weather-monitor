import { Kafka, KafkaMessage } from "kafkajs";
import { config } from "./config";

console.log("Starting Consumer...");

type ReceivedMessage = {
    topic: String;
    partition: Number;
    message: KafkaMessage;
};

const runConsumer = async () => {
    const kafka = new Kafka({ brokers: [config.brokers] });
    const consumer = kafka.consumer({ groupId: "iago" });

    await consumer.connect();

    await consumer.subscribe({ topic: "numeros", fromBeginning: true });

    await consumer.run({
        eachMessage: async ({ topic, partition, message }: ReceivedMessage) => {
            console.log({
                topic,
                partition,
                message: message.value?.toString,
            });
        },
    });
};

runConsumer();
