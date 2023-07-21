import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import path from "path";

import * as config from "../configs/index.js";

/* --------------------------------------------------------*/
// USING DISK STORAGE
/* --------------------------------------------------------*/
export const createDiskStorage = (directory) =>
  multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, directory);
    },
    filename: (req, file, cb) => {
      cb(null, "IMG" + "-" + Date.now() + path.extname(file.originalname));
    },
  });

/* --------------------------------------------------------*/
// USING CLOUDINARY STORAGE
/* --------------------------------------------------------*/

// CLOUDINARY CONFIG
cloudinary.config({
  cloud_name: config.CLOUDINARY_CLOUD_NAME,
  api_key: config.CLOUDINARY_API_KEY,
  api_secret: config.CLOUDINARY_API_SECRET,
});

// UPLOAD IMAGE TO CLOUDINARY
export const createCloudinaryStorage = (directory) =>
  new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: directory,
      allowedFormats: ["jpg", "png", "gif"],
    },
  });

/* --------------------------------------------------------*/
// UPLOADER
/* --------------------------------------------------------*/
export const createUploader = (storage) =>
  multer({
    storage: storage,
    limits: { fileSize: 1000000 },
  });
