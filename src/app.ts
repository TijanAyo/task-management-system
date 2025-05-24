import * as dotenv from "dotenv";
dotenv.config();
import express, { Request, Response } from "express";
import compression from "compression";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());

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

export default app;
