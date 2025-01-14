import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

dotenv.config();

const app = express();

app.get("/depo79DB", (req, res) => {    
    res.send("Hello World!");
});

app.listen(5000, () => {
    connectDB();
    console.log("server started at http://localhost:5000");
})