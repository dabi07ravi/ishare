const express = require('express');
const app = express();
const dotenv = require('dotenv');
const dbConnection = require('./config/db.config')
const FileUploadRouter = require('./routes/file')


//middleware
app.use(express.json());

//dotenv
dotenv.config();

// db connection
dbConnection();

//routes
app.use('/api/upload',FileUploadRouter)
app.use('/api/showfile', FileUploadRouter)
app.use('/api/download',FileUploadRouter)
app.use('/api/file',FileUploadRouter)



// port
const Port = process.env.PORT || 4000;
// server
app.listen(Port, () => console.log(`Server is listenning on the port ${Port}`))