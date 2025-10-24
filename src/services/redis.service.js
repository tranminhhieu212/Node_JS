"use strict";
const redis = require("redis");
const {
  reservationInventory,
} = require("../models/repositories/inventory.repo");
const { host, port, password } = require("../configs/redis.config");

// Tạo client Redis cho Docker / port 6380 / password
const redisClient = redis.createClient({
  socket: {
    host: host || "localhost",
    port: port || 6380,
  },
  password: password || "Password1!",
});

redisClient.on("connect", () => console.log("Redis Connected"));
redisClient.on("error", (err) => console.error("Redis Error", err));

// Kết nối Redis
(async () => {
  await redisClient.connect();
})();

// Hàm lấy lock
const acquireLock = async (productId, quantity, cartId) => {
  const key = `lock_v1010_${productId}`;
  const retryTimes = 10;
  const expireTime = 3000; // ms

  for (let i = 0; i < retryTimes; i++) {
    // Redis v4: dùng set với NX + PX
    const result = await redisClient.set(key, expireTime, {
      NX: true,
      PX: expireTime,
    });
    console.log({ result });

    if (result === "OK") {
      // thao tác với inventory
      const isReservation = await reservationInventory({
        productId,
        quantity,
        cartId,
      });
      if (!isReservation.modifiedCount) {
        // gia hạn thời gian lock nếu thao tác thất bại
        await redisClient.pexpire(key, expireTime);
        return key;
      }
      return null;
    } else {
      // retry sau 100ms
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }
};

// Hàm release lock
const releaseLock = async (key) => {
  return await redisClient.del(key);
};

module.exports = {
  acquireLock,
  releaseLock,
};
