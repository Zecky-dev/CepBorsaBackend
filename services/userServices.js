import cloudinary from "../helpers/cloudinary.js";

// Image format: base64

/**
 * @type {import("express").RequestHandler}
 */
const uploadPhoto = async (req, res) => {
  try {
    const { image, imageName } = req.body;
    if (!image) {
      return res.status(400).json({
        error: "Image not found!",
      });
    }

    const uploadResponse = await cloudinary.uploader.upload(
      `data:image/png;base64,${image}`,
      {
        folder: "uploads",
        public_id: imageName,
        overwrite: true,
      }
    );
    return res.status(201).json({
      success: true,
      url: uploadResponse.secure_url,
    });
  } catch (error) {
    const statusCode = error?.response?.status || 500;
    const message =
      error?.response?.data?.error?.message || "Unknown error occurred";

    return res.status(statusCode).json({
      success: false,
      message: message,
    });
  }
};

export { uploadPhoto };
