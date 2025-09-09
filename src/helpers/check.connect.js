'use strict';

const mongoose = require('mongoose');
const os = require('os');
const process = require('process');
const _SECONDS = 10000;

const countConnect = () => {
    const numConnection = mongoose.connections.length;
    return numConnection;
}

const checkOverload = () => {
    setInterval(() => {
        const numConnection = mongoose.connections.length;
        const nuCores = os.cpus().length;
        const memUsage = process.memoryUsage().rss;
        const maxConnection = nuCores * 5
     
        console.log(`Active connections ${numConnection}, max allowed ${maxConnection}`);
        console.log(`Memory overload: ${memUsage / 1024 / 1024} MB`);

        if (numConnection > maxConnection) {
            console.log(`Overload: ${numConnection} connections`);

            // send a message to the user
            // notify.send(); 
        }
    }, _SECONDS) // motior evert 5 seconds
}

module.exports = {
    countConnect, 
    checkOverload
}