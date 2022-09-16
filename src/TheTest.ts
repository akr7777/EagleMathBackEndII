import nodemailer from "nodemailer";
const dotenv = require("dotenv");
if (process.env.NODE_ENV !== "production") {
    dotenv.config();
}

async function test2(email: string, activationLink: string) {
    const transporter = nodemailer.createTransport({
        service: process.env.TEST_SMTP_SERVICE,
        auth: {
            user: process.env.TEST_SMTP_USER,
            pass: process.env.TEST_SMTP_PASSWORD,
        },
    });


    console.log('_____________\nVERIFYING....')
    await transporter.verify(function (error: any, success: any) {
        if (error) {
            console.log('EEEEEEEE:', error);
        } else {
            console.log("Server is ready to take our messages");
        }
    });

    console.log('_____________\nTRANSPORTER....')
    console.log('transporter=', transporter)
    console.log('_____________\nTRY TO SEND EMAIL....')

    await transporter.sendMail({
        from: process.env.TEST_SMTP_USER,
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

test2('akrov77@gmail.com', 'Send mail TEST');