const amqp = require("amqplib");

const runProducer = async () => {
  try {
    const connect = await amqp.connect("amqp://localhost");
    const channel = await connect.createChannel();

    const notificationExchange = "notification-exchange";
    const notificationQueue = "notification-queue";
    const notificationRExchangeDLX = "notification-exchange-dlx";
    const notificationRoutingKeyDLX = "notification_routing_key_dlx";

    await channel.assertExchange(notificationExchange, "direct", {
      durable: true,
    });

    const queueResult = await channel.assertQueue(notificationQueue, {
      exclusive: false,
      deadLetterExchange: notificationRExchangeDLX,
      deadLetterRoutingKey: notificationRoutingKeyDLX,
    });

    await channel.bindQueue(queueResult.queue, notificationExchange);

    const fixed_message = "hello, RabbitMQ for Node.js! - DXL test - new product";

    channel.sendToQueue(queueResult.queue, Buffer.from(fixed_message), {
        expiration: "10000"
    });

    console.log(`[x] Sent ${fixed_message} successfully`);

    setTimeout(() => {
      connect.close();
      process.exit(0);
    }, 500);
  } catch (error) {
    console.log(error);
  }
};

runProducer();
