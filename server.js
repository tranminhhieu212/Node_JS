const app = require('./src/app');

const PORT = process.env.PORT || 3055;

const server = app.listen(PORT, () => {
    console.log(`Ecommence server running on port ${PORT}`);
})

process.on("SIGINT", () => {
    server.close(() => {
        console.log("Server closed");
        process.exit(0);

        // send a message to the user when the server is closed
        // TODO
    });
});