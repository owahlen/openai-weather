import {z} from "zod";

export const WeatherQuerySchema = z.object({
    latitude: z.coerce
        .number()
        .min(-90)
        .max(90)
        .describe("Latitude must be between -90 and 90 degrees"),
    longitude: z.coerce
        .number()
        .min(-180)
        .max(180)
        .describe("Longitude must be between -180 and 180 degrees"),
});

export type WeatherQuery = z.infer<typeof WeatherQuerySchema>;
