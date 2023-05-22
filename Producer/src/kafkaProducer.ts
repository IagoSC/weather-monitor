import { Kafka, Producer } from "kafkajs";
import { config } from "./config";
import { AxiosResponse } from "axios";
import { Event } from "./statistics";

const kafka = new Kafka({ brokers: [config.brokers] });

const producer = kafka.producer({ allowAutoTopicCreation: true });
producer.connect();

export const notify = (local: string, events: Event[]) => {
    Promise.all(
        events.map((event) => {
            const message = {
                topic: local,
                acks: 0,
                messages: [
                    { key: event.intensity, value: JSON.stringify(event) },
                ],
            };
            producer.send(message);
        })
    );
};

export const disconect = () => {
    producer.disconnect();
};
