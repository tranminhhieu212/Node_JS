"use strict";

const notificationService = require("../services/notification.service");
const { SuccessResponse } = require("../core/success.response");

class NotificationController {
  listNotiByUser = async (req, res, next) => {
    return new SuccessResponse({
      message: "Get list noti by user successfully",
      metadata: await notificationService.listNotiByUser({
        userId: 1
      }),
    }).send(res);
  };
 
}

module.exports = new NotificationController();
