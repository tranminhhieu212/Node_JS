'use strict'

const mongoose = require('mongoose');
const { db: { host, name, port, username, password } } = require('../configs/config.mongodb');

// const connectString = `mongodb://${host}:${port}/${name}`;
const connectString = `mongodb://${username}:${password}@${host}:${port}/${name}?authSource=admin`;

console.log(connectString);

class Database {
    constructor() {
        this.connect();
    }

    connect(type = 'mongodb') {
        mongoose.connect(connectString, {
            maxPoolSize: 50
        }).then(() => {
            console.log("MongoDB connected");
        }).catch((err) => {
            console.log(err);
        });
    }

    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }
}

const instanceMongoDB = Database.getInstance();

module.exports = instanceMongoDB;