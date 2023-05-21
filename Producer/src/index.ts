import * as Notifier from "./kafkaProducer";
import { Location, getMeteo, metrics } from "./meteoApi";
import { checkStats, generateStats, Event } from "./statistics";

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
    console.log("Getting news");
    const weatherResponse = await getMeteo(topic.location);
    console.log("Generating Status");
    const stats = generateStats(weatherResponse.hourly);
    const events = [] as Event[];
    for (const [metric, values] of stats.entries())
        events.push(...checkStats(metric, values));
    console.log("Sending Events");
    Notifier.notify(topic.name, events);
};

const run = async () => {
    while (true) {
        updateWeather(topics[0]);
        await new Promise((resolve) =>
            setTimeout(() => {
                resolve(null);
            }, 60000)
        );
    }
};

run();