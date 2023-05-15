import { Kafka, Producer } from "kafkajs";
import { config } from "./config";
import { AxiosResponse } from "axios";
import { Event } from "./statistics";

const kafka = new Kafka({ brokers: [config.brokers] });

const producer = kafka.producer({ allowAutoTopicCreation: true });
producer.connect();

export const notify = (local: string, events: Event[]) => {
    Promise.all(
        events.map(({ time, ...event }) => {
            producer.send({
                topic: time,
                messages: [{ key: local, value: JSON.stringify(event) }],
            });
        })
    ); //.then((res) => console.log(res));
};

export const disconect = () => {
    producer.disconnect();
};
