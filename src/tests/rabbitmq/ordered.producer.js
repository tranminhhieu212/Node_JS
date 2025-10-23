
const amqp = require('amqplib');

const runProducer = async () => {
    try {
        const connect = await amqp.connect('amqp://localhost');
        const channel = await connect.createChannel();

        const queueName = 'ordered-queue-message';
        await channel.assertQueue(queueName, {
            durable: true
        });

        const message = "Ordered message - producer -: ";

        for (let i = 0; i < 10; i++) {  
            channel.sendToQueue(queueName, Buffer.from(message + i), {
                persistent: true
            });
            console.log(`[x] Sent ${message + i}`);
        }
        
        setTimeout(() => {
            connect.close();
            process.exit(0);
        }, 1000)

    } catch (error) {
        console.log(error);
    }
}

runProducer().catch((err) => console.log(err));