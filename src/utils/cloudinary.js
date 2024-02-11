import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

const uploadOnCloudinary = async (localfilepath) => {
  try {
    if (!localfilepath) {
      return null;
    }

    const response = await cloudinary.uploader.upload(localfilepath, {
      resource_type: "auto",
    });

    fs.unlinkSync(localfilepath);

    return response;
  } catch (error) {
    fs.unlinkSync(localfilepath);
    return null;
  }
};

export { uploadOnCloudinary };
