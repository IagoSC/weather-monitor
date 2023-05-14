import axios from "axios";

const baseUrl = "https://api.open-meteo.com/v1";

export type Location = [number, number];

export type MetricTypes =
    | "temperature_2m"
    | "precipitation_probability"
    | "windspeed_10m"
    | "uv_index";

export const metrics = [
    "temperature_2m",
    "precipitation_probability",
    "windspeed_10m",
    "uv_index",
] as const;

const units = {
    temperature_unit: "celsius",
    precipitation_unit: "mm",
    windspeed_unit: "ms",
} as const;

export const params = {
    ...units,
    hourly: metrics.join(","),
    forecast_days: 3,
    timezone: "auto",
};

export const getMeteo = async (location: Location) => {
    const locationParams = {
        latitude: location[0],
        longitude: location[1],
    };
    const { data } = await axios.get(baseUrl + "/forecast", {
        params: { ...params, ...locationParams },
    });
    return data;
};

