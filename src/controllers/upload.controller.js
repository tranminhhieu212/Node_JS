"use strict";
const uploadSevice = require("../services/upload.service");
const { SuccessResponse } = require("../core/success.response");
const { BadRequestErorr } = require("../core/errror.response");

class UploadController {
  uploadImageFromUrl = async (req, res, next) => {
    console.log(req);
    new SuccessResponse({
      metadata: await uploadSevice.uploadImageFromURL(req?.body?.urlImage),
    }).send(res);
  };

  uploadImageFromLocal = async (req, res, next) => {
    const { file } = req;
    if (!file) {
      throw new BadRequestErorr("File not found");
    }
    new SuccessResponse({
      metadata: await uploadSevice.uploadImageFromLocal({
        path: file.path,
        folderName: 'product/shopId',
      }),
    }).send(res);
  };

  uploadMultipleImageFromLocal = async (req, res, next) => {
    const { files } = req;
    if (!files) {
      throw new BadRequestErorr("File not found");
    }
    new SuccessResponse({
      metadata: await uploadSevice.uploadMultipleImage({
        files,
        folderName: 'product/multiple',
      }),
    }).send(res);
  }
  ;
}

module.exports = new UploadController();
