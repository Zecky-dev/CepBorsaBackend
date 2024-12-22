const express = require("express");

const {
  fetchAllStocks,
  fetchStockData
} = require("../services/stockServices");
const { successResponse, errorResponse } = require("../helpers/response");

const router = express.Router();

/**
 * @swagger
 * /stock:
 *   get:
 *     summary: Bir halk arz hissesi ile ilgili verilerini getir
 *     description: Bir hisse adını girerek verilerini alabilirsiniz.
 *     parameters:
 *       - in: query
 *         name: stockName
 *         required: true
 *         description: Şirket adı, alt link olmalıdır.
 *         schema:
 *           type: string
 *           example: bin-ulasim-ve-akilli-sehir-teknolojileri-a-s
 *     responses:
 *       200:
 *         description: Başarılı yanıt.
 */

router.get("/", async (req, res) => {
  const { stockName } = req.query;
  if (!stockName) {
    return res.status(400).json({
      statusCode: 400,
      message: "Lütfen geçerli bir şirket ismi giriniz!",
    });
  }

  try {
    const data = await fetchStockData(stockName);
    successResponse(res, data, { stockName });
  } catch (error) {
    errorResponse(res, error);
  }
});

/**
 * @swagger
 * /stock/list:
 *   get:
 *     summary: Halka arz hisse listesini getir
 *     description: Yıl ve sayfa numarası belirleyerek halka arz şirket listesini alabilirsiniz.
 *     parameters:
 *       - in: query
 *         name: year
 *         required: false
 *         description: Yıl bilgisi.
 *         schema:
 *           type: integer
 *           example: 2023
 *       - in: query
 *         name: page
 *         required: false
 *         description: Sayfa numarası.
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Başarılı yanıt.
 *       400:
 *         description: Geçersiz sayfa veya yıl bilgisi.
 *       500:
 *         description: Sunucu hatası.
 */

router.get("/list", async (req, res) => {
  let { year, page } = req.query;

  if (year && year < 1986) {
    return res.status(400).json({
      statusCode: 400,
      message: "Geçersiz yıl, girdiğiniz yıl değeri minimum 1986 olmalıdır!",
    });
  }
  if (page && page <= 0) {
    return res.status(400).json({
      statusCode: 400,
      message:
        "Geçersiz sayfa numarası! Sayfa numarası 1 veya üzeri olmalıdır.",
    });
  }

  if (!year) {
    year = new Date().getFullYear();
  }
  if (!page) {
    page = 1;
  }

  try {
    const data = await fetchAllStocks(year, page);
    successResponse(res, data, { year, page, total: data.length });
  } catch (error) {
    errorResponse(res, error);
  }
});

module.exports = router;
