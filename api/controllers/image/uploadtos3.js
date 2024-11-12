// uploadToS3.js
const AWS = require('aws-sdk');
const path = require('path');

// Configure AWS SDK with environment variables (or replace these values directly)
AWS.config.update({
    accessKeyId: "",
    secretAccessKey: "",
    region: "",
});

const s3 = new AWS.S3();

/**
 * Uploads a file buffer to S3 and returns the URL of the uploaded file.
 * @param {Buffer} fileBuffer - The buffer of the file to upload.
 * @param {string} fileName - The name to save the file as in the S3 bucket.
 * @param {string} mimeType - The MIME type of the file (e.g., 'image/jpeg').
 * @returns {Promise<string>} - The URL of the uploaded file.
 */
async function uploadtos3(fileBuffer, fileName, mimeType) {
    const params = {
        Bucket: "", // S3 bucket name
        Key: `properties/${Date.now()}-${path.basename(fileName)}`, // Unique file name
        Body: fileBuffer,
        ContentType: mimeType,
    };

    try {
        const data = await s3.upload(params).promise();
        return data.Location; // Return the file's URL
    } catch (error) {
        console.error('Error uploading file to S3:', error);
        throw new Error('Failed to upload file to S3');
    }
}

module.exports = { uploadtos3 };
