import * as Notifier from "./kafkaProducer";
import { Location, getMeteo } from "./meteoApi";

console.log("Starting Producer...");

type Topic = {
    name: string;
    location: Location;
};

const topics: Topic[] = [
    { name: "camburi", location: [-20.275155, -40.282214] },
    { name: "barrote", location: [-20.149803, -40.184616] },
];

const updateWeather = async (topic: Topic) => {
    const weather = await getMeteo(topic.location);
};
