
import { v2 as cloudinary } from "cloudinary";

const {
    CLAUDINARY_CLOUD_NAME,
    CLAUDINARY_CLOUD_API_KEY,
    CLAUDINARY_CLOUD_API_SECRET
} = process.env;

cloudinary.config({
  cloud_name: CLAUDINARY_CLOUD_NAME,
  api_key: CLAUDINARY_CLOUD_API_KEY,
  api_secret: CLAUDINARY_CLOUD_API_SECRET
});

// Default olarak Cloudinary'yi dışa aktar
export default cloudinary;
