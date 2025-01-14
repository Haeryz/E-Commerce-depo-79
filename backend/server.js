import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import Beratroutes from "./routes/berat.route.js";
import Kategoriroutes from "./routes/kategori.route.js";
import Productroutes from "./routes/product.route.js";

dotenv.config();

const app = express();

//routes
app.use(express.json());
app.use("/api/Berat", Beratroutes);
app.use("/api/kategori", Kategoriroutes);
app.use("/api/product", Productroutes);

app.get("/depo79DB", (req, res) => {    
    res.send("Hello World!");
});

app.listen(5000, () => {
    connectDB();
    console.log("server started at http://localhost:5000");
})