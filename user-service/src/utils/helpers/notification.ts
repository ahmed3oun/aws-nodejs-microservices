import twilio from 'twilio';

const accountId = process.env.TWILIO_ACCOUNT_SID || 'ACfab75a838301bdf1b5fad77412d99f8b';
const authToken = process.env.TWILIO_AUTH_TOKEN || 'b189e17d2d63744f0343764bd0744725e555'
const twilioClient = twilio(accountId, authToken)

export const generateAccessCode = () => {
    const verification_code = Math.floor(10000 + Math.random() * 900000)
    let expiry = new Date()
    expiry.setTime(new Date().getTime() + 30 * 60 * 1000)

    return {
        verification_code,
        expiry
    }
}
// TODO: send verification code via mail SMTP
export const sendVerificationCodeMail = async (code: number, toEmail: string) => {
    /* const response = await twilioClient.messages.create({
        body: `Your verification code is ${code} it will expire within 30 minutes.`,
        from: '+12055555555',
        to: toPhoneNum.trim()
    }) */
    //const response = await twilioClient.messaging.

    //return response
}