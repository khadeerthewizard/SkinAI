import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import dotenv from "dotenv";
import ConnectDB from "./lib/db.config";
import UserRouter from "./routes/UserRoutes";
import SubscriberRouter from "./routes/SubscriberRoutes";

dotenv.config();

const app: Application = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

/** User Routes */
app.use("/api/v1/user", UserRouter);
app.use("/api/v1/launch", SubscriberRouter);

app.get("/", (req: Request, res: Response): void => {
  res.sendFile(path.join(__dirname, "templates", "serverTemplate.html"));
});

app.use((req: Request, res: Response): void => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction): void => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

const mongoURI: string | undefined = process.env.MONGO_URI;

if (!mongoURI) {
  console.error("MONGO_URI is not defined in environment variables");
  process.exit(1); // Exit if no connection string is provided
}

ConnectDB(mongoURI)
  .then((): void => {
    console.log("Database connected successfully!");
  })
  .catch((error: Error): void => {
    console.error("Database connection failed:", error);
  });

export default app;
