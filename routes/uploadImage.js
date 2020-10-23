const express = require("express");
const router = express.Router();
const Image = require("../models/image");
const path = require("path");
const crypto = require("crypto");
const mongoose = require("mongoose");
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");
const auth = require("../middleware/auth");
const config = require("config");

// Mongo URI
const mongoURI = config.get("connection_url");
// Create storage engine
const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString("hex") + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: "uploads",
        };
        resolve(fileInfo);
      });
    });
  },
});
const upload = multer({ storage });

// Create mongo connection
const connect = mongoose.createConnection(mongoURI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

// Init gfs
let gfs;

connect.once("open", () => {
  // Init stream
  gfs = new mongoose.mongo.GridFSBucket(connect.db, {
    bucketName: "uploads",
  });
});
// @route POST /upload
// @desc  Uploads file to DB
router.post("/upload", auth, upload.single("file"), (req, res) => {
  console.log(req.body);
  //check for existing image
  Image.findOne({ caption: req.body.caption })
    .then((image) => {
      console.log(image);
      if (image) {
        return res.status(200).json({
          success: false,
          message: "Image already exists",
        });
      }

      let newImage = new Image({
        caption: req.body.caption,
        filename: req.file.filename,
        fileId: req.file.id,
      });
      newImage
        .save()
        .then((image) => {
          res.status(200).json({
            success: true,
            image,
          });
        })
        .catch((err) => res.status(500).json(err));
    })
    .catch((err) => res.status(500).json(err));
});

//fetch all images

router.get("/files", (req, res, next) => {
  gfs.find().toArray((err, files) => {
    if (!files || files.length === 0) {
      return res.status(200).json({
        success: false,
        message: "No files available",
      });
    }
    //image formats supported...
    files.map((file) => {
      if (
        file.contentType === "image/jpeg" ||
        file.contentType === "image/png" ||
        file.contentType === "image/svg+xml"
      ) {
        file.isImage = true;
      } else {
        file.isImage = false;
      }
    });
    res.status(200).json({
      success: true,
      files,
    });
  });
});

router.get("/file/:filename", (req, res) => {
  gfs.find({ filename: req.params.filename }).toArray((err, files) => {
    if (!files[0] || files.length === 0) {
      return res.status(200).json({
        success: false,
        message: "No files available",
      });
    }
    res.status(200).json({
      success: true,
      file: files[0],
    });
  });
});

router.get("/image/:filename", (req, res) => {
  gfs.find({ filename: req.params.filename }).toArray((err, files) => {
    if (!files[0] || files.length === 0) {
      return res.status(200).json({
        success: false,
        message: "No files available",
      });
    }
    if (
      files[0].contentType === "image/jpeg" ||
      files[0].contentType === "image/png" ||
      files[0].contentType === "image/svg+xml"
    ) {
      gfs.openDownloadStreamByName(req.params.filename).pipe(res);
    } else {
      res.status(404).json({
        err: "Not an image",
      });
    }
  });
});

module.exports = router;
