import axios from "axios";

const baseUrl = "https://api.open-meteo.com/v1";

export type Location = [number, number];

const metrics = [
    "temperature_2m",
    "rain",
    "windspeed_10m",
    "uv_index",
] as const;

const units = {
    temperature_unit: "celsius",
    precipitation_unit: "mm",
    windspeed_unit: "ms",
};

export const getMeteo = async (location: Location) => {
    const params = {
        ...units,
        latitude: location[0],
        longitude: location[1],
        hourly: metrics.join(","),
        timezone: "auto",
    };
    const { data } = await axios.get(baseUrl + "/forecast", { params });
    console.log(data);
};

getMeteo([-20.149803, -40.184616]);
