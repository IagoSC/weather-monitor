import {
    Consumer as KafkaConsumer,
    Producer as KafkaProducer,
    Kafka,
} from "kafkajs";
import { ReceivedMessage } from ".";
import { config } from "./config";
import {
    DataStats,
    DayStats,
    Event,
    Intensity,
    Local,
    SuperEvent,
    SuperEventDay,
    SuperEventTriple,
} from "./consumerTypes";

const kafka = new Kafka({ brokers: [config.brokers] });

const SUPER_EVENT = "super_event";

export class Consumer {
    private consumer: KafkaConsumer;
    private producer: KafkaProducer;
    private dataStats: DataStats = {};
    private id: number;
    private local: Local | null = null;

    constructor() {
        this.id = 999 + Math.floor(Math.random() * 9000);
        this.consumer = kafka.consumer({ groupId: `consumer-${this.id}` });
        this.consumer.connect();

        this.producer = kafka.producer({ allowAutoTopicCreation: true });
        this.producer.connect();
        setInterval(() => this.checkStats(), 12000);
    }

    subscribe(topic: Local) {
        this.local = topic;
        console.log("subscribing to", topic);
        this.consumer.subscribe({
            topics: [topic, SUPER_EVENT],
            fromBeginning: true,
        });
    }

    sendSuperDay(intensity: Intensity, day: Date) {
        console.log("super_event_day");
        const event: SuperEventDay = {
            producedBy: this.id,
            local: this.local as string,
            intensity,
            date: day,
            type: "super_day",
        };
        this.producer.send({
            topic: SUPER_EVENT,
            acks: 0,
            messages: [
                {
                    key: this.local,
                    value: JSON.stringify(event),
                },
            ],
        });
    }

    sendSuperTriple(intensity: Intensity, firstDay: Date) {
        const event: SuperEventTriple = {
            producedBy: this.id,
            local: this.local as string,
            intensity,
            firstDay: firstDay,
            lastDay: new Date(firstDay.valueOf() + 2 * 24 * 60 * 60 * 1000),
            type: "super_triple",
        };
        this.producer.send({
            topic: SUPER_EVENT,
            acks: 0,
            messages: [
                {
                    key: this.local,
                    value: JSON.stringify(event),
                },
            ],
        });
    }

    checkStats() {
        console.log("\nChecking stats");
        const today = new Date().toISOString().split("T")[0];
        const goodDates = [];
        const badDates = [];
        const entries = Object.entries(this.dataStats);
        for (const [date, stats] of entries) {
            console.log("\n\n");
            if (today.localeCompare(date) > 0) continue;
            const diff = Object.values(stats).reduce(
                (acc, time) => time.good.size - time.bad.size + acc,
                0
            );
            console.log("diff", diff);
            const dateFormat = new Date(date);
            if (diff > 3) {
                goodDates.push(dateFormat.valueOf());
                this.sendSuperDay("good", dateFormat);
            } else if (diff < -3) {
                badDates.push(dateFormat.valueOf());
                this.sendSuperDay("bad", dateFormat);
            }
        }
        goodDates
            .sort((a, b) => a - b)
            .forEach((date, idx, arr) => {
                const nextDay = date + 24 * 60 * 60 * 1000;
                const otherDay = date + 24 * 60 * 60 * 1000;
                if (arr[idx + 1] == nextDay && arr[idx + 2] == otherDay) {
                    this.sendSuperTriple("good", new Date(date));
                }
            });
        badDates
            .sort((a, b) => a - b)
            .forEach((date, idx, arr) => {
                const nextDay = date + 24 * 60 * 60 * 1000;
                const otherDay = date + 24 * 60 * 60 * 1000;
                if (arr[idx + 1] == nextDay && arr[idx + 2] == otherDay) {
                    this.sendSuperTriple("bad", new Date(date));
                }
            });
    }

    run() {
        this.consumer.run({
            eachMessage: async ({ topic, message }: ReceivedMessage) => {
                if (topic === SUPER_EVENT) {
                    const value: SuperEvent = JSON.parse(
                        message.value!.toString()
                    );
                    if (value.type == "super_day") {
                        console.log(
                            `from ${
                                value.producedBy
                            }: SUPER ${value.intensity.toUpperCase()} EVENT AT LOCAL ${
                                value.local
                            } - ${value.date}`
                        );
                    } else {
                        console.log(
                            `from ${
                                value.producedBy
                            }: SUPER TRIPLE-${value.intensity.toUpperCase()} EVENT AT LOCAL ${
                                value.local
                            } - ${value.firstDay} to ${value.lastDay}`
                        );
                    }
                } else {
                    const value: Event = JSON.parse(message.value!.toString());
                    if (!this.dataStats[value.date]) {
                        const newDayStats: DayStats = {
                            morning: {
                                good: new Set(),
                                bad: new Set(),
                            },
                            evening: {
                                good: new Set(),
                                bad: new Set(),
                            },
                            midday: {
                                good: new Set(),
                                bad: new Set(),
                            },
                            night: {
                                good: new Set(),
                                bad: new Set(),
                            },
                        };
                        this.dataStats[value.date] = newDayStats;
                        console.log(this.dataStats);
                    }
                    const dayStats = this.dataStats[value.date][value.time];
                    dayStats[value.intensity].add(value.metric);
                }
            },
        });
    }

    disconect() {
        this.consumer.disconnect();
    }
}
