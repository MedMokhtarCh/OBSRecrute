import dotenv from "dotenv";
import cors from "cors";
import express from "express";
import proxy from "express-http-proxy";

dotenv.config();

const app = express();
console.log(process.env.PORT);
console.log(process.env.FRONTEND_URL);

app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  })
);
app.use(express.json());

app.use("/user-service", proxy("http://localhost:4001"));
app.use("/job-service", proxy("http://localhost:4002"));
app.use("/application-service", proxy("http://localhost:4003"));
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Something went wrong!");
});
app.listen(process.env.PORT, () => {
  console.log(`Gateway is Listening to Port ${process.env.PORT}`);
});
