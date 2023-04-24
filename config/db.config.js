const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
let url = 'mongodb://127.0.0.1:27017/file'


function dbConnection(){
mongoose.connect(url,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(() => console.log("Database is connected")).catch((err) => console.log("Error connecting to the database!!!!"));
}

module.exports = dbConnection