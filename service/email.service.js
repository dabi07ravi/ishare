const nodemailer = require('nodemailer')

async function sendMail({sender, receiver, subject, text}){
    const transport = nodemailer.createTransport({
        host: "smtp.example.com",
        port: 587,
        tls: {
            rejectUnauthorized: true,
            minVersion: "TLSv1.2"
        }
    })

    const info = await transport.sendMail({
        from : sender,
        to : receiver,
        subject : subject,
        text : text
    })
}

module.exports = sendMail;