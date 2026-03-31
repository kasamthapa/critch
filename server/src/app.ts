import express from "express";
import { Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userAuth from "./routes/user.route";
import { errorMiddleware } from "./middleware/error.middleware";
import projectRoute from "./routes/project.route";
const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use("/api/v1/auth", userAuth);
app.use("/api/v1/projects", projectRoute);
app.get("/", (req, res) => {
  console.log("cookies", req.cookies);
  res.send("WElcome to critch");
});
app.use(errorMiddleware);
export default app;
