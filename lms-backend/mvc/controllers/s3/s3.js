const AWS = require("aws-sdk");
const dotenv = require("dotenv");
const xlsx = require("node-xlsx");
const fs = require('fs');
dotenv.config();
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

function uploadFileToS3(bucketName, key, file) {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
    Body: file,
  };

  return new Promise((resolve, reject) => {
    s3.upload(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}
function checkFirst(params) {
  return new Promise((resolve, reject) => {
    s3.headObject(params)
      .on("success", function (response) {
        resolve(s3.getObject(params).createReadStream());
      })
      .on("error", function (error) {
        // File did not exist in numeric directory, get in GUID
        reject("no file");
      })
      .send();
  });
}
function downloadExcelFromS3(key) {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
  };
  return new Promise(async (resolve, reject) => {
    try {
      var file = await checkFirst(params);
      var buffers = [];

      file.on("data", function (data) {
        buffers.push(data);
      });
      file.on("end", function () {
        var buffer = Buffer.concat(buffers);
        var workbook = xlsx.parse(buffer);
        resolve(workbook);
      });
    } catch (error) {
      reject(error);
    }
  });
}
function downloadFileFromS3(key) {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
  };
  return new Promise((resolve, reject) => {
    s3.getObject(params, function (err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

function downloadExcelFromS3asFile(key) {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
  };
  return new Promise(async (resolve, reject) => {
    try {
      var file = await checkFirst(params);
      var buffers = [];

      file.on("data", function (data) {
        buffers.push(data);
      });
      file.on("end", function () {
        var buffer = Buffer.concat(buffers);
        fs.writeFile('uploads/'+key+'.xlsx', buffer, function (err){
          if(err){
            reject(err);
          }
          resolve('uploads/'+key+'.xlsx');
        })
      });
    } catch (error) {
      reject(error);
    }
  });
}

function uploadBase64ImgToS3(bucketName, key, base64Img) {
  const base64Data = new Buffer.from(
    base64Img.replace(/^data:image\/\w+;base64,/, ""),
    "base64"
  );

  const type = base64Img.split(";")[0].split("/")[1];

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
    Body: base64Data,
    ContentEncoding: "base64",
    ContentType: `image/${type}`,
  };

  return new Promise((resolve, reject) => {
    s3.upload(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}
module.exports = {
  uploadFileToS3,
  downloadFileFromS3,
  downloadExcelFromS3,
  uploadBase64ImgToS3,
  downloadExcelFromS3asFile
};
