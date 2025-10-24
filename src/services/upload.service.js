"use strict";

const { claudinary } = require("../configs/claudinary.config");
const fs = require('fs');

//1 upload of url image

const uploadImageFromURL = async (urlImage) => {
  try {
    const url =
      urlImage ||
      "https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m48rhdmf67ow42_tn.webp";
    const folderName = "product/shopId",
      fileName = "image_02.jpg";

    const result = claudinary.uploader.upload(url, {
      folder: folderName,
      public_id: fileName,
    });
    console.log(result);
    return result;
  } catch (error) {
    console.error(error);
  }
};

const uploadImageFromLocal = async ({ path, folderName }) => {
  try {
    const result = await claudinary.uploader.upload(path, {
      folder: folderName,
      public_id: "thumd",
    });

    fs.unlinkSync(path);

    return {
      image_url: result?.secure_url,
      shopId: path,
      thumd_url: await claudinary.url(result?.public_id, { width: 200, height: 200, format: "jpg" }),
    };
  } catch (error) {
    console.error(error);
  }
};

const uploadMultipleImage = async ({ files, folderName }) => {
    try {
        const uploadPromises = files.map(async (file) => {
            const result = await claudinary.uploader.upload(file.path, {
                folder: folderName,
                public_id: file.originalname,
            });

            fs.unlinkSync(file.path);

            return {
                image_url: result?.secure_url,
                shopId: result?.public_id
            }
        });
        
        const results = await Promise.all(uploadPromises);
        return results;
    } catch (error) {
        console.error(error);
    }
};

module.exports = {
  uploadImageFromURL,
  uploadImageFromLocal,
  uploadMultipleImage
};
