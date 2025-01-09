import express from "express";
import { askQuestion } from "../services/botServices.js";

const router = express.Router();

/**
 * @swagger
 * /bot/ask:
 *   get:
 *     summary: Ekonomi ve finans konularında AI destekli soru-cevap
 *     description: |
 *       Ekonomi, finans ve bankacılık konularında Türkçe veya İngilizce sorular sorabilirsiniz.
 *
 *       Desteklenen konular:
 *       - Ekonomi
 *       - Finans
 *       - Bankacılık
 *       - Döviz
 *       - Borsa
 *       - Yatırım ve Ticaret
 *       - Kurumsal Finans
 *
 *       Not: Kişisel finansal tavsiyeler, yatırım tavsiyeleri, borsa/hisse önerileri verilmemektedir.
 *     tags:
 *       - Bot
 *     parameters:
 *       - in: query
 *         name: question
 *         required: true
 *         description: Sorulacak soru (Türkçe veya İngilizce)
 *         schema:
 *           type: string
 *           example: "Enflasyon nedir?"
 *     responses:
 *       200:
 *         description: Başarılı yanıt
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: string
 *                   description: AI tarafından üretilen yanıt
 *                   example: "Enflasyon, bir ekonomide mal ve hizmetlerin genel fiyat düzeyinin sürekli artış göstermesidir..."
 *       400:
 *         description: Geçersiz istek
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: "Question cannot be empty"
 *                     type:
 *                       type: string
 *                       example: "invalid_request_error"
 *                     status:
 *                       type: integer
 *                       example: 400
 *       401:
 *         description: API anahtarı geçersiz
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: "Invalid API key provided"
 *                     type:
 *                       type: string
 *                       example: "authentication_error"
 *                     status:
 *                       type: integer
 *                       example: 401
 *       429:
 *         description: İstek limiti aşıldı
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: "Rate limit exceeded. Please try again later"
 *                     type:
 *                       type: string
 *                       example: "rate_limit_error"
 *                     status:
 *                       type: integer
 *                       example: 429
 *       500:
 *         description: Sunucu hatası
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: "An internal server error occurred"
 *                     type:
 *                       type: string
 *                       example: "api_error"
 *                     status:
 *                       type: integer
 *                       example: 500
 */

router.get("/ask", async (req, res) => {
  const question = req.query.question;
  try {
    const response = await askQuestion(question);
    if (response.success) {
      res.status(200).json({
        success: true,
        data: response.data,
      });
    } else {
      res.status(response.error.status).json({
        success: false,
        error: {
          message: response.error.message,
          type: response.error.type,
        },
      });
    }
  } catch (error) {
    console.log("BOT_ASK_QUESTION_ERROR", error);
    throw error;
  }
});

export default router;
