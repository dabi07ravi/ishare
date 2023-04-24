const mongoose = require("mongoose");
const fileSchema = mongoose.Schema({
  id: { type: String, require: true },
  filename: { type: String, require: true },
  path: { type: String, require: true },
  size: { type: String, require: true },
  sender: { type: String, require: false },
  receiver: { type: String, require: false },
}, {timestamps: true});

const fileModel = mongoose.model('files',fileSchema);
module.exports = fileModel
