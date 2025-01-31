import mongoose from "mongoose";
import Struk from "../models/struk.model.js";

export const getStruk = async (req, res) => {
  try {
    if (req.params.id) {
      const struk = await Struk.findById(req.params.id);
      if (!struk) {
        return res
          .status(404)
          .json({ success: false, message: "Struk not found" });
      }
      return res.status(200).json({ success: true, struk });
    } else {
      const struks = await Struk.find();
      return res.status(200).json({ success: true, struks });
    }
  } catch (error) {
    console.log("Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createStruk = async (req, res) 