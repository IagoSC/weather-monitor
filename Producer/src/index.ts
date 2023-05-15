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
    const weatherResponse = await getMeteo(topic.location);
    console.log(weatherResponse);
    const stats = generateStats(weatherResponse.hourly);
    const events = [] as Event[];
    for (const [metric, values] of stats.entries())
        events.push(...checkStats(metric, values));
    Notifier.notify(topic.name, events);
};
updateWeather(topics[0]); 