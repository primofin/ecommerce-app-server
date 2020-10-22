import sgMail from '@sendgrid/mail'
import { SENDGRID_API_KEY, FROM_EMAIL } from '../util/secrets'

sgMail.setApiKey(SENDGRID_API_KEY)

const sendEmail = (receiver: string, subject: string, content: string) => {
  try {
    const data = {
      to: receiver,
      from: FROM_EMAIL,
      subject,
      html: content,
    }
    return sgMail.send(data)
  } catch (e) {
    return new Error(e)
  }
}

export default sendEmail
