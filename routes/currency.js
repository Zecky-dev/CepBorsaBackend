import express from "express";
import { fetchCurrencies } from "../services/currencyServices.js";
import { errorResponse } from "../helpers/response.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const response = await fetchCurrencies();
    return res.status(200).json({
      success: true,
      data: response.data,
    });
  } catch (error) {
    errorResponse(res, error);
  }
});

export default router;
