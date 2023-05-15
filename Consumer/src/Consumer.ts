import { Consumer as KafkaConsumer, Kafka } from "kafkajs";
import { ReceivedMessage } from ".";
import { config } from "./config";

const kafka = new Kafka({ brokers: [config.brokers] });

export class Consumer {
    private consumer: KafkaConsumer;
    constructor(groupId: string) {
        this.consumer = kafka.consumer({ groupId });
        this.consumer.connect();
        this.consumer;
    }
    subscribe(topic: string | RegExp) {
        this.consumer.subscribe({ topic, fromBeginning: false });
    }

    run() {
        this.consumer.run({
            eachMessage: async ({
                topic,
                partition,
                message,
            }: ReceivedMessage) => {
                console.log({
                    topic,
                    partition,
                    message: JSON.parse(message.value?.toString()),
                });
            },
        });
    }

    disconect() {
        this.consumer.disconnect();
    }
}
