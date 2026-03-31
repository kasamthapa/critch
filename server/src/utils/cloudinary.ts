import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { ApiError } from "./ApiError";

export const uploadOnCloudinary = async (localFilePath: string) => {
  try {
    if (!localFilePath || localFilePath.length == 0) return null;
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    return {
      public_id: response.public_id,
      url: response.secure_url,
    };
  } catch (err) {
    console.log(err);
    fs.unlinkSync(localFilePath);
    return null;
  }
};

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
