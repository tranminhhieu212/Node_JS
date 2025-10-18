'use strict';

const notificationModel = require("../models/notification.model");

const pushNotiToSystem = async (
    {
        type= "SHOP-001",
        senderId,
        receiverId,
        content, option = {}
    }
) => {
    let noti_content;
    if (type === "SHOP-001") {
        noti_content = `${senderId} đã tạo sản phẩm mới`;
    } else if (type === "PROMOTION-001") {
        noti_content = `${senderId} đã tạo khuyến mãi mới`;
    } else {
        noti_content = content;
    }

    const noti = await notificationModel.create({
        noti_type: type,
        noti_senderId: senderId,
        noti_receiverId: receiverId,
        noti_content,
        noti_option: option
    });
    return noti;
}

const listNotiByUser = async ({ userId = 1, isRead = false, type = "All" }) => {
    const match = {noti_receiverId: userId};
    if (type !== "All") {
        match.noti_type = type;
    }
    return await notificationModel.aggregate([
      {
        $match: match,
      },{
        $project: {
          _id: 1,
          noti_type: 1,
          noti_senderId: 1,
          noti_receiverId: 1,
          noti_content: {
            $concat: [
              { $substr: ["$noti_option.shop_name", 0, 20] },
              " vua moi them mot san pham moi ",
              { $substr: ["$noti_option.product_name", 0, 20] },
            ],
          },
          noti_option: 1,
          noti_createdAt: 1,
          noti_isRead: 1,
        },
      }
    ]);
        
}

module.exports = {
    pushNotiToSystem, 
    listNotiByUser
}