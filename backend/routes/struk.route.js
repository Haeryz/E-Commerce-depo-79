import express from "express";
import { getStruk, createStruk, updateStruk, deleteStruk } from "../controllers/struk.controller.js";

const route = express.Router();

route.get("/", getStruk);
route.get("/:id", getStruk);
route.post("/", createStruk);
route.put("/:id", updateStruk);
route.delete("/:id", deleteStruk);

export default route;