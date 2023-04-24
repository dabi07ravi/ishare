const fileModel = require("../schema/file.schema");
const path = require("path");
const multer = require("multer");
const { Types } = require("mongoose");
const sendMail = require("../service/email.service");
require("dotenv").config();

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueName = `${
      file.originalname.split(".")[0]
    }-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

let upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 * 100 },
}).single("myFile");

async function uploadFile(req, res) {
  upload(req, res, async (err) => {
    //validate request
    if (!req.file) {
      return res.status(500).send({ message: "Please upload the file" });
    }
    if (err) {
      return res.status(500).send({ error: err.message });
    }
    //store file
    const data = new fileModel({
      id: Date.now(),
      filename: req.file.filename,
      path: req.file.path,
      size: req.file.size,
    });

    try {
      const response = await data.save();
      return res
        .status(200)
        .send({ url: `${process.env.APP_BASE_URL}/files/${response.id}` });
    } catch (error) {
      console.log(`Error while storing data into database is ${error.message}`);
    }
  });
}

async function showFile(req, res) {
  try {
    let data = await fileModel.findOne({ id: req.params.id });
    if (!data) {
      return res.status(500).send({ message: "file not found" });
    }
    return res.status(200).send({
      id: data.id,
      fileName: data.filename,
      fileSize: data.size,
      link: `${process.env.APP_BASE_URL}/files/download/${data.id}`,
    });
  } catch (error) {
    console.log(`Error while getting the file is ${error.message}`);
  }
}

async function downloadFile(req, res) {
  try {
    let data = await fileModel.findOne({ id: req.params.id });
    if (!data) {
      return res.status(500).send({ message: "file not found" });
    }
    let filePath = `${__dirname}/../${data.path}`;
    res.download(filePath);
  } catch (error) {
    console.log(`Error while downloading the file is ${error.message}`);
  }
}

async function sendEmail(req, res) {
  try {
    let { id, sender, receiver } = req.body;
    if (!id && !sender && !receiver) {
      return res.status(422).send({ message: "All fields are required" });
    }
    let file = await fileModel.findOne({ id: id });
    if (!file) {
      return res.status(422).send({ message: "file not found" });
    }
    file.sender = sender;
    file.receiver = receiver;
    let response = await file.save();

    // sendmail

    await sendMail({
      sender: sender,
      receiver: receiver,
      subject: "File Sharing",
      text: `${sender} shared a file with you`,
    });

    return res.status(200).send({message : "file send successfully"});
  } catch (error) {
    console.log(`Error while sending the file is ${error.message}`);
  }
}

module.exports = {
  uploadFile,
  showFile,
  downloadFile,
  sendEmail,
};
