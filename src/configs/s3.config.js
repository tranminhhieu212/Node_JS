'use strict';

const { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');

const S3Config = {
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_BUCKET_ACCESS_KEY,
        secretAccessKey: process.env.AWS_BUCKET_SECERT_KEY
    }
}


const S3 = new S3Client(S3Config);

module.exports = {
    S3,
    PutObjectCommand,
    GetObjectCommand,
    DeleteObjectCommand
} 