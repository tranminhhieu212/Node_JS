'use strict'

const mongoose = require('mongoose');
const { db: { host, name, port } } = require('../configs/config.mongodb');

const connectString = `mongodb://${host}:${port}/${name}`;
console.log(connectString);

class Database {
    constructor() {
        this.connect();
    }

    connect(type = 'mongodb') {
        mongoose.connect(connectString, {
            maxPoolSize: 50
        }).then(() => {
            console.log("Connected to database");
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