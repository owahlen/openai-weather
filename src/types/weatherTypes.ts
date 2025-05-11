interface PeriodForecast {
    period: string;
    temperature: string;
    wind: string;
    forecast: string;
}

interface WeatherResponse {
    latitude: number;
    longitude: number;
    forecast: PeriodForecast[];
}
