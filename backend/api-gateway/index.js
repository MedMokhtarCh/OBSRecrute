require("dotenv").config();
const cors = require("cors");
const express = require("express");
const app = express();
const proxy = require("express-http-proxy");
console.log(process.env.PORT); // Vérifie que PORT est bien défini
console.log(process.env.FRONTEND_URL); // Vérifie que FRONTEND_URL est bien défini

app.listen(process.env.PORT, () => {
  console.log(`Gateway is Listening to Port ${process.env.PORT}`);
});

app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  })
);
app.use(express.json());
