import nodemailer from "nodemailer";
const dotenv = require("dotenv");

if (process.env.NODE_ENV !== "production") {
    dotenv.config();
}

async function sendActivationEmail(email: string, activationLink: string) {
    const transporter = nodemailer.createTransport({
        service: 'yandex',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD,
        },
    });

    console.log('_____________VERIFYING MAIL_AGENT....')
    await transporter.verify(function (error: any, success: any) {
        if (error) {
            console.log('EEEEEEEE:', error);
        } else {
            console.log("Server is ready to take our messages");
        }
    });

    console.log('TRANSPORTER IS READY....')
    //console.log('transporter=', transporter)
    console.log('TRY TO SEND EMAIL....')

    await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: email,
        subject: `Активация аккаунта на сайте ${process.env.API_URL}`,
        text: '',
        html:
            `
                <div>
                    <h1>Для активации перейдите по ссылке:</h1>
                    <a href="${activationLink}">${activationLink}</a>
                 </div>
                `
    });
}

module.exports = sendActivationEmail;
//test2('akrov77@gmail.com', 'dsf');