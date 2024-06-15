import express from "express";
import cors from "cors";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import couponRouter from "./router/couponRouter.js";
import authRouter from "./router/authRouter.js";
import dotenv from "dotenv";
import mysql2 from "mysql2";
dotenv.config();

const db = mysql2.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT || 3306,
});
db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL");
});
const port = process.env.SERVER_PORT || 5000;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "*",
  })
);
app.get("/", (req, res) => {
  console.log("started");
  res.send("hi");
});
app.use("/api/auth", authRouter);
app.use("/api/coupons", couponRouter);

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Server started on port ${port}`));

export default db;
