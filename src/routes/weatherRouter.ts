import {Request, Response, Router} from "express";
import {getForecast} from "../nws-api.js";
import {WeatherQuerySchema} from "../schemas/weatherSchema.js";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
    const result = WeatherQuerySchema.safeParse(req.query);

    if (!result.success) {
        res.status(400).json({
            error: "Invalid coordinates",
            details: result.error.errors.map(err => ({
                path: err.path.join('.'),
                message: err.message
            }))
        });
        return;
    }
    const { latitude, longitude } = result.data;

    try {
        const forecastResponse = await getForecast(latitude, longitude);
        const forecast = forecastResponse.properties.periods.map((period): PeriodForecast => ({
            period: period.name || "Unknown",
            temperature: `${period.temperature || "Unknown"}°${period.temperatureUnit || "F"}`,
            wind: `${period.windSpeed || "Unknown"} ${period.windDirection || ""}`,
            forecast: period.shortForecast || "No forecast available"
        }));
        const weatherResponse : WeatherResponse = {
            latitude,
            longitude,
            forecast
        };
        console.log('📡 Weather API:', JSON.stringify(weatherResponse, null, 2));
        res.json(weatherResponse);
    } catch (err) {
        console.error("Weather API error:", err);
        res.status(500).json({error: "Failed to fetch weather data"});
    }
});

export default router;
