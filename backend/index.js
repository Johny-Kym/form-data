const express = require("express");
const cors = require("cors");
const app = express();
const multer = require("multer");
const fileUploadCloudinary = require("./utils/fileUpload");
const storage = multer.diskStorage({});
const upload = multer({ storage });
const cloudinary = require("cloudinary").v2;
require("dotenv").config();

app.use(cors());

//Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

//form-data upload API endpoint
app.post("/upload", upload.array("image"), async (req, res) => {
  //validation
  if (!req.files)
    return res.status(400).json({ message: "Images must be provided" });
  //Upload both 2 images to cloudinary
  const imagesUrl = req.files.map(async (file) => {
    return await fileUploadCloudinary(file.path);
  });

  //Wait all images to upload
  Promise.all(imagesUrl)
    .then((results) => {
      console.log(`${results.length} files uploaded to cloudinary`);
      //save image to your db
      console.log("uploading to db simulation");
      //delaty 200ms
      setTimeout(
        () => {
          res.json({
            message: ` Profile successfully upated`,
            data: results,
          });
        },

        200
      );
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({ message: err?.message });
    });
});

const PORT = process.env.PORT || 500;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
