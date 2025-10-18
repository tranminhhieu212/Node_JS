'use strict';

const dev = {
    app: {
        port: process.env.DEV_APP_PORT || 3055
    }, 
    db: {
        host: process.env.DEV_DB_HOST || 'localhost',
        port: process.env.DEV_DB_PORT || 27017,
        name: process.env.DEV_DB_NAME || 'ecommerce',
        username: process.env.DEV_DB_USERNAME || 'mongoadmin',
        password: process.env.DEV_DB_PASSWORD || 'Password1!'
    }
}

const prod = {
    app: {
        port: process.env.PROD_APP_PORT || 3055
    }, 
    db: {
        host: process.env.PROD_DB_HOST || 'localhost',
        port: process.env.PROD_DB_PORT || 27017,
        name: process.env.PROD_DB_NAME || 'prod_ecommerce',
        username: process.env.PROD_DB_USERNAME || 'mongoadmin',
        password: process.env.PORD_DB_PASSWORD || 'Password1!'
    }
}

const config = { dev, prod };
const env = process.env.NODE_ENV || 'prod';

module.exports = config[env];