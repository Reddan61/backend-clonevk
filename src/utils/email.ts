import nodemailer from "nodemailer"

const options = {
    host:  process.env.NODEMAILER_HOST as string,
    port:  Number(process.env.NODEMAILER_PORT),
    secure: true,
    auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASS
    }
}


const html = (code:string) => {
    return `Код подтверждения ${code}`
}

const mailer = nodemailer.createTransport(options)

export interface ISendMail {
    to:string,
    subject:string,
    code:string
}


export const sendEmail = ({
        to,
        subject,
        code
    }:ISendMail) => (
        mailer.sendMail({
            from:"clone-vk@ya.ru",
            to,
            subject,
            html: html(code)
        })
)
