
const amqp = require('amqplib');
const message = "hello, RabbitMQ for Node.js!";

const runConsumer = async () => {
    try {
        const connect = await amqp.connect('amqp://localhost');
        const channel = await connect.createChannel();

        const queueName = 'test-topic';
        await channel.assertQueue(queueName, {
            durable: true
        });

        channel.consume(queueName, (msg) => {
            console.log(`[x] Received ${msg.content.toString()}`);
        }, {
            noAck: true
        });
    } catch (error) {
        console.log(error);
    }
}

runConsumer();