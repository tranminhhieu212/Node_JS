const amqp = require('amqplib');
const message = "hello, RabbitMQ for Node.js!";

const runProducer = async () => {
    try {
        const connect = await amqp.connect('amqp://localhost');
        const channel = await connect.createChannel();

        const queueName = 'test-queue';
        await channel.assertQueue(queueName, {
            durable: true
        });

        channel.sendToQueue(queueName, Buffer.from(message));
        console.log(`[x] Sent ${message}`);
    } catch (error) {
        console.log(error);
    }
}

runProducer();