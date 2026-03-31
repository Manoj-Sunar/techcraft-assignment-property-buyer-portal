// src/server.ts
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { ConnectDB } from "./DBConnection.js";
import { BuyerRouter } from "./Routes/Buyer.route.js";
import { errorHandler } from "./Middleware/errror.middleware.js";
import { propertyRouter } from "./Routes/Property.route.js";
import { favoritePropertyRouter } from "./Routes/FavoriteProperty.route.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const allowedOrigins = ["http://localhost:3000"];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = `The CORS policy for this site does not allow access from the specified Origin.`;
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true, // important: allow cookies
  })
);

// all api routes
app.use("/api/buyer",BuyerRouter);

app.use("/api/properties",propertyRouter);

app.use("/api/favorite",favoritePropertyRouter);

app.use(errorHandler)
// Start server
const Start = async () => {
  await ConnectDB()

  app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });
};

Start();