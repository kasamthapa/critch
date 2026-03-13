import express from "express";
import dotenv from "dotenv";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3030;

app.get("/", (req, res) => {
  res.send("WElcom to critch");
});
app.listen(PORT, () => {
  console.log(`Server is listening on PORT: ${PORT}`);
});
