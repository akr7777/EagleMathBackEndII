const nodemailer = require('nodemailer');
const dotenv = require("dotenv");

if (process.env.NODE_ENV !== "production") {
    dotenv.config();
}

class MailService {
    public transporter;

    constructor() {
        //console.log('process.env:', process.env)
        //console.log('constructor: SMTP_USER=', process.env.SMTP_USER, 'SMTP_PASSWORD=', process.env.SMTP_PASSWORD)
        this.transporter = nodemailer.createTransport({
            /*host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: process.env.MAIL_SECURE,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
            }*/
            service: 'yandex',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            },
        });
    }
    async sendActivationMail (to: string, link: string) {

        console.log('sendActivationMail: this.transporter=', this.transporter);

        console.log('----VERIFYING-----')
        await this.transporter.verify(function (error:any, success:any) {
            if (error) {
                console.log('EEEEEEEE:', error);
            } else {
                console.log("Server is ready to take our messages");
            }
        });

        console.log('----SENDING-----')

        try {
            await this.transporter.sendMail({
                from: process.env.SMTP_USER,
                to,
                subject: `Активация аккаунта на сайте ${process.env.API_URL}`,
                text: '',
                html:
                    `
                <div>
                    <h1>Для активации перейдите по ссылке:</h1>
                    <a href="${link}">${link}</a>
                 </div>
                `
            });
        } catch (e) {
            console.log("___MAIL error===: ", e)
        }

    }
}

module.exports = new MailService();