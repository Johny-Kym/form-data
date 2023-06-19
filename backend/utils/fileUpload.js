const cloudinary = require("cloudinary").v2;

const fileUpload = (file) => {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(file, (error, result) => {
        if (result && result.secure_url) {
          return resolve(result);
        }
        console.log(error);
        return reject({ message: error.message });
      });
    });
  };

  module.exports = fileUpload