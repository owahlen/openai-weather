// Helper functions for making National Weather Service (NWS) API requests

const NWS_API_BASE = "https://api.weather.gov";
const USER_AGENT = "weather-app/1.0";

export async function getForecast(latitude: number, longitude: number): Promise<ForecastResponse> {
    const pointsUrl = `${NWS_API_BASE}/points/${latitude.toFixed(4)},${longitude.toFixed(4)}`;
    const pointsData = await makeNWSRequest<PointsResponse>(pointsUrl);

    if (!pointsData) {
        throw new Error(`Failed to retrieve grid point data for coordinates: ${latitude}, ${longitude}. This location may not be supported by the NWS API (only US locations are supported).`);
    }

    const forecastUrl = pointsData.properties?.forecast;
    if (!forecastUrl) {
        throw new Error(`Failed to get forecast URL from grid point data: ${pointsData}`);
    }

    // Get forecast data
    const forecastData = await makeNWSRequest<ForecastResponse>(forecastUrl);
    if (!forecastData) {
        throw new Error(`Failed to retrieve forecast data for coordinates: ${latitude}, ${longitude}`);
    }

    const periods = forecastData.properties?.periods || [];
    if (periods.length === 0) {
        throw new Error(`No forecast periods available for coordinates: ${latitude}, ${longitude}`);
    }

    return forecastData;
}

// Helper function for making NWS API requests
async function makeNWSRequest<T>(url: string): Promise<T | null> {
    const headers = {
        "User-Agent": USER_AGENT,
        Accept: "application/geo+json",
    };

    try {
        const response = await fetch(url, {headers});
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return (await response.json()) as T;
    } catch (error) {
        console.error("Error making NWS request:", error);
        return null;
    }
}

interface ForecastPeriod {
    name?: string;
    temperature?: number;
    temperatureUnit?: string;
    windSpeed?: string;
    windDirection?: string;
    shortForecast?: string;
}


interface PointsResponse {
    properties: {
        forecast?: string;
    };
}

interface ForecastResponse {
    properties: {
        periods: ForecastPeriod[];
    };
}