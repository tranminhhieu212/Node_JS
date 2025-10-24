"use strict";

const { claudinary } = require("../configs/claudinary.config");
const fs = require("fs");
const {
  S3,
  PutObjectCommand,
  GetObjectCommand,
} = require("../configs/s3.config");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { getSignedUrl : getSignedUrlCF } = require("@aws-sdk/cloudfront-signer");

const crypto = require("crypto");

const randomName = () => crypto.randomBytes(16).toString("hex");
const cloudfront_domain = process.env.AWS_CLOUDFRONT_DOMAIN;

//1 upload of url image -- claudinary
// const uploadImageFromURL = async (urlImage) => {
//   try {
//     const url =
//       urlImage ||
//       "https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m48rhdmf67ow42_tn.webp";
//     const folderName = "product/shopId",
//       fileName = "image_02.jpg";

//     const result = claudinary.uploader.upload(url, {
//       folder: folderName,
//       public_id: fileName,
//     });
//     console.log(result);
//     return result;
//   } catch (error) {
//     console.error(error);
//   }
// };
const uploadImageFromURL = async (urlImage) => {
  try {
    const url =
      urlImage ||
      "https://down-vn.img.susercontent.com/file/vn-11134207-7ras8-m48rhdmf67ow42_tn.webp";
    const folderName = "product/shopId";
    const fileName = randomName(); // use random file name to avoid overwrite

    const result = await claudinary.uploader.upload(url, {
      folder: folderName,
      public_id: fileName,
    });

    console.log(result);
    return result;
  } catch (error) {
    console.error("uploadImageFromURL error:", error);
    throw error;
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
      thumd_url: await claudinary.url(result?.public_id, {
        width: 200,
        height: 200,
        format: "jpg",
      }),
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
        shopId: result?.public_id,
      };
    });

    const results = await Promise.all(uploadPromises);
    return results;
  } catch (error) {
    console.error(error);
  }
};

const uploadImageFromURLWithS3 = async (file) => {
  try {
    if (!file || !file.buffer) throw new Error("File buffer missing");

    const key = `${randomName()}.jpg`;
    await S3.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype || "image/jpeg",
      })
    );

    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
    });
    
    // option 1: cloudfront access to our s3 bucket and this link can access without expired time
    const image_url = cloudfront_domain + key;

    // option 2: this is signed url valid for 1 hour of s3
    const signedUrl = await getSignedUrl(S3, command, { expiresIn: 3600 });
    
    // option 3: this is signed url valid for 1 hour of cloudfront and are used key-pair to access
    const cloudfront_url = getSignedUrlCF({
      url: image_url,
      dateLessThan: new Date(Date.now() + 1 * 60 * 1000), 
      privateKey: process.env.AWS_CLOUDFRONT_PRIVATE_KEY,
      keyPairId: process.env.AWS_CLOUDFRONT_KEY_PAIR_ID,
    });


    return {
      key,
      image_url,
      signedUrl,
      cloudfront_url,
      message: "Upload successful (URL valid for 1 hour)",
    };
  } catch (error) {
    console.error("uploadImageFromURLWithS3 error:", error);
    throw error;
  }
};

module.exports = {
  uploadImageFromURL,
  uploadImageFromLocal,
  uploadMultipleImage,
  uploadImageFromURLWithS3,
};
