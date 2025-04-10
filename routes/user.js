import express from "express";
import { uploadPhoto } from "../services/userServices.js";

const router = express.Router();

/**
 * @swagger
 * /uploadPhoto:
 *   post:
 *     summary: Kullanıcının profil fotoğrafını yükler
 *     description: Base64 formatında bir görsel yükleyerek kullanıcı profil fotoğrafını kaydedin.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 description: Base64 formatındaki görsel verisi.
 *                 example: "iVBORw0KGgoAAAANSUhEUgAA..."
 *               imageName:
 *                 type: string
 *                 description: Görselin Cloudinary'de saklanacak ismi.
 *                 example: "profile_picture_123"
 *     responses:
 *       201:
 *         description: Görsel başarıyla yüklendi.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 url:
 *                   type: string
 *                   description: Yüklenen görselin erişim URL’si.
 *                   example: "https://res.cloudinary.com/xyz/image/upload/v123/profile_picture_123.png"
 *       400:
 *         description: Eksik veya hatalı görsel verisi.
 *       500:
 *         description: Sunucu hatası.
 */


router.post("/uploadPhoto", uploadPhoto);


export default router;
