import "./config/env";
import express, { Request, Response } from "express";
import compression from "compression";
import "./config/db";
import { authRoute } from "./routes/auth.route";
import { errorHandler } from "./helpers/error-handler";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());

app.use("/api/v1/auth", authRoute);

app.get("/", (_req: Request, res: Response) => {
  return res.status(200).json({
    success: true,
    message: "Task Management System - Scelloo Backend Assessment",
  });
});

app.get("/health", (_req: Request, res: Response) => {
  return res.status(200).json({
    success: true,
    message: "Server up and running",
  });
});

app.use(errorHandler);

app.all("*", (_req: Request, res: Response) => {
  return res.status(404).json({
    success: false,
    message: "Route does not exist, check provided endpoint and try again",
  });
});

export default app;
