const express = require("express");
const cors = require("cors");
const app = express();
const multer = require("multer");
const fileUploadCloudinary = require("./utils/fileUpload");
const storage = multer.diskStorage({});
const upload = multer({ storage });
const cloudinary = require("cloudinary").v2;

app.use(cors());
cloudinary.config({
  cloud_name: "dh5ouumzj",
  api_key: "749826882816916",
  api_secret: "N82LFMH_Ne4EC8eNCXyUfFP_adY",
});

app.post("/upload", upload.array("image"), async (req, res) => {
  console.log(req.body.name);
  if (req.files.length > 4)
    return res.status(400).json({
      message: "You cannot upload more than 4 files",
    });
    console.log(req.files)
  //Upload files to cloudinary
  const imagesUrl = req.files.map(async (file) => {
    return await fileUploadCloudinary(file.path);
  });

  Promise.all(imagesUrl)
    .then((results) => {
      console.log(`${results.length} files uploaded to cloudinary`);
      //save urls to database
      console.log("uploading to db");
      setTimeout(
        () => {
          res.json({
            message: ` Profile successfully upated`,
            data:results
          });
        },

        0
      );
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({ message: err?.message });
    });
});

app.listen("10000", () => {
  console.log("Server started on port 10000...");
});
