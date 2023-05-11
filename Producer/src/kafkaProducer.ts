import { Kafka, Producer } from "kafkajs";
import { config } from "./config";
import { AxiosResponse } from "axios";

const kafka = new Kafka({ brokers: [config.brokers] });

const producer = kafka.producer();
producer.connect();

export const notify = (news: any) => {
    news.producer?.send({
        topic: "Numeros",
        messages: [{ value: `${news}` }],
    });
};

export const disconect = () => {
    producer.disconnect();
};
