import express, {Request, Response, NextFunction} from "express";
import { config } from "dotenv";
import weather from "./routes/weatherRouter.js";

config();

const app = express();
const port = 3000;

app.use(express.json());
app.use("/weather", weather);

// Handle unknown routes
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: "Not found" });
});

// Handle internal server errors
app.use((err: unknown, req: Request, res: Response, next:NextFunction) => {
  console.error("❌ Server error:", err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(port, () => {
  console.log(`🌐 API server running at http://localhost:${port}`);
});
