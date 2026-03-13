import express from "express";
import dotenv from "dotenv";
import userAuth from "./routes/user.route.js";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3030;

app.use(express.json());
app.use("/api/v1/auth", userAuth);
app.get("/", (req, res) => {
  res.send("WElcome to critch");
});
app.listen(PORT, () => {
  console.log(`Server is listening on PORT: ${PORT}`);
});
