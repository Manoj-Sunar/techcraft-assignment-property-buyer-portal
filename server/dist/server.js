// src/server.ts
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { ConnectDB } from "./DBConnection.js";
dotenv.config();
const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// Example route
app.get("/", (req, res) => res.send("Server is running"));
// Start server
const Start = async () => {
    await ConnectDB();
    app.listen(port, () => {
        console.log(`Server is listening on port ${port}`);
    });
};
Start();
//# sourceMappingURL=server.js.map