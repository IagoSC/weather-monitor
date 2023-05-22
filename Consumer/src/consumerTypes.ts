export type Local = "camburi" | "barrote";
export type MetricTypes =
    | "temperature_2m"
    | "precipitation_probability"
    | "windspeed_10m"
    | "uv_index";
export type Intensity = "bad" | "good";

export type Time = "morning" | "midday" | "evening" | "night";

export type Event = {
    date: string;
    time: Time;
    metric: MetricTypes;
    intensity: Intensity;
};

export type DayStats = Record<
    Time,
    {
        good: Set<MetricTypes>;
        bad: Set<MetricTypes>;
    }
>;
export type DataStats = Record<string, DayStats>;

export type SuperEventBase = {
    producedBy: number;
    local: string;
    intensity: Intensity;
};

export type SuperEventTriple = SuperEventBase & {
    type: "super_triple";
    firstDay: Date;
    lastDay: Date;
};

export type SuperEventDay = SuperEventBase & {
    type: "super_day";
    date: Date;
};

export type SuperEvent = SuperEventTriple | SuperEventDay;
