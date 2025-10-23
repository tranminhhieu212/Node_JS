
const amqp = require('amqplib');

const runConsumer = async () => {
    try {
        const connect = await amqp.connect('amqp://localhost');
        const channel = await connect.createChannel();

        const queueName = 'ordered-queue-message';
        await channel.assertQueue(queueName, {
            durable: true
        });

        channel.prefetch(1); // limit the number of unacknowledged messages // procsess one message at a time

        channel.consume(queueName, (msg) => {
            setTimeout(() => {
                console.log(`Consumer [x] Received ${msg.content.toString()}`);
                channel.ack(msg);
            }, Math.random() * 1000);   
        });
    } catch (error) {
        console.log(error);
    }
}

runConsumer().catch((err) => console.log(err));