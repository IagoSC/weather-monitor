import { MetricTypes } from "./meteoApi";

type Time = "morning" | "noom" | "evening" | "night";

type DailyTimesAverage = {
    date: string;
    morning: number;
    noom: number;
    evening: number;
    night: number;
};

// type DailyTimesAverage = Map<"date" | Time, string | number>;

type MetricsAverage = Map<MetricTypes, DailyTimesAverage[]>;

type MeteoObject = Map<MetricTypes, number[]>;

export type Event = {
    date: string;
    time: Time;
    metric: MetricTypes;
    intensity: "low" | "high";
};

const batchArray = <T>(array: T[], size: number): T[][] => {
    const batches = new Array<T[]>(array.length / size).fill([]);
    for (const [idx, batch] of batches.entries()) {
        batch.push(...array.slice(idx * size, (idx + 1) * size));
    }
    return batches;
};

const getAverage = (array: number[]) => {
    const sum = array.reduce((x, y) => x + y);
    const avg = sum / array.length;
    return avg;
};

export const generateStats = (meteoResponseTimely: any): MetricsAverage => {
    const { time, ...metricsArray } = meteoResponseTimely || {};
    const metrics = new Map() as MetricsAverage;

    for (const [metric, values] of Object.entries(
        metricsArray as MeteoObject
    )) {
        const metricStats: DailyTimesAverage[] = batchArray<number>(
            values,
            24
        ).map((day, index) => {
            const date = time[index * 24].split("T")[0] as string;
            return {
                date,
                morning: getAverage(day.slice(6, 10)),
                noom: getAverage(day.slice(10, 14)),
                evening: getAverage(day.slice(14, 18)),
                night: getAverage(day.slice(18, 22)),
            } as DailyTimesAverage;
        });
        metrics.set(metric as MetricTypes, metricStats);
    }

    return metrics;
};

export const checkStats = (
    metric: MetricTypes,
    values: DailyTimesAverage[]
) => {
    switch (metric) {
        case "precipitation_probability":
            return checkRain(values);
        case "uv_index":
            return checkRadiation(values);
        case "temperature_2m":
            return checkTemperature(values);
        case "windspeed_10m":
            return checkWind(values);
        default:
            return [];
    }
};

const checkWind = (intensity: DailyTimesAverage[]): Event[] => {
    const highWind = (x: number) => x > 13.8;
    const lowWind = (x: number) => x < 5.4;

    const events = [] as Event[];
    for (const { date, ...dayStats } of intensity) {
        for (const [time, wind] of Object.entries(dayStats)) {
            if (highWind(wind))
                events.push({
                    date,
                    metric: "windspeed_10m",
                    intensity: "high",
                    time: time as Time,
                });
            else if (lowWind(wind))
                events.push({
                    metric: "windspeed_10m",
                    intensity: "low",
                    time: time as Time,
                    date,
                });
        }
    }

    return events;
};

const checkTemperature = (intensity: DailyTimesAverage[]): Event[] => {
    const highTemp = (x: number) => x > 32;
    const lowTemp = (x: number) => x < 20;

    const events = [] as Event[];
    for (const { date, ...dayStats } of intensity) {
        for (const [time, temp] of Object.entries(dayStats)) {
            if (highTemp(temp))
                events.push({
                    date,
                    metric: "temperature_2m",
                    intensity: "high",
                    time: time as Time,
                });
            else if (lowTemp(temp))
                events.push({
                    metric: "temperature_2m",
                    intensity: "low",
                    time: time as Time,
                    date,
                });
        }
    }

    return events;
};

const checkRadiation = (intensity: DailyTimesAverage[]): Event[] => {
    const highRadiation = (x: number) => x > 7;
    const lowRadiation = (x: number) => x < 3;

    const events = [] as Event[];
    for (const { date, ...dayStats } of intensity) {
        for (const [time, radiation] of Object.entries(dayStats)) {
            if (highRadiation(radiation))
                events.push({
                    date,
                    metric: "uv_index",
                    intensity: "high",
                    time: time as Time,
                });
            else if (lowRadiation(radiation))
                events.push({
                    metric: "uv_index",
                    intensity: "low",
                    time: time as Time,
                    date,
                });
        }
    }

    return events;
};

const checkRain = (intensity: DailyTimesAverage[]): Event[] => {
    const highRain = (x: number) => x > 7;
    const lowRain = (x: number) => x < 3;

    const events = [] as Event[];
    for (const { date, ...dayStats } of intensity) {
        for (const [time, rain] of Object.entries(dayStats)) {
            if (highRain(rain))
                events.push({
                    date,
                    metric: "precipitation_probability",
                    intensity: "high",
                    time: time as Time,
                });
            else if (lowRain(rain))
                events.push({
                    metric: "precipitation_probability",
                    intensity: "low",
                    time: time as Time,
                    date,
                });
        }
    }

    return events;
};

// Temperatura < 18 | 18 ~ 24 | 24 ~ 28 | 28 ~ 32 | > 32
// Chuva ~0 | ~ 20 | > 20
// Vento ~5,4 | 5,4 ~ 13,8 | > 13,8
// UV ~3 | 3 ~ 6 | 6 ~ 8 | > 8
