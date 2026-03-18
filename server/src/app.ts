import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userAuth from "./routes/user.route";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use("/api/v1/auth", userAuth);
app.get("/", (req, res) => {
  console.log("cookies", req.cookies);
  res.send("WElcome to critch");
});

export default app;
