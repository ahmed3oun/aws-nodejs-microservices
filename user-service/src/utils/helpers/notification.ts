import twilio from 'twilio';
import ErrorHandler from './ErrorHandler';

const account_id = process.env.TWILIO_ACCOUNT_SID || 'ACfab75a838301bdf1b5fad77412d99f8b';
const authToken = process.env.TWILIO_AUTH_TOKEN || '48ffa076094abe7e5c463686db162236_a547'
const sid = 'VA4db1c35ad7bd91359b56d0f598aea68b_5a4'
const twilioClient = twilio(account_id, authToken)

export const generateAccessCode = () => {
    const verification_code = Math.floor(10000 + Math.random() * 900000)
    let expiry = new Date()
    expiry.setTime(new Date().getTime() + 30 * 60 * 1000)

    return {
        verification_code,
        expiry
    }
}

export const sendVerificationCodeSMS = async (code: number, toPhoneNum: string) => {
    const response = await twilioClient.messages.create({
        body: `Your verification code is ${code} it will expire within 30 minutes.`,
        from: '+21693611028',
        to: toPhoneNum.trim()
    })

    console.log({
        twilio_response: response
    });

    return response || null
}

export const sendVerificationCodeMail = async (code: number, toEmail: string) => {
    try {
        const response = await twilioClient.verify.v2.services(sid)
            .verifications.create({
                to: toEmail,
                channel: 'mail',
                customMessage: `Your verification code is :${code} \n Singn in and write this code to verify your account\n Thanks.`
            })
        return response || null;
    } catch (error) {
        throw new ErrorHandler({
            message: 'Problem occured in send verification code mail',
            description: `${JSON.stringify(error)}`,
            statusCode: 500
        })
    }

}