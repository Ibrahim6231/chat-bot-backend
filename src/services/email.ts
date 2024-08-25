const sgMail = require("@sendgrid/mail");
import { config } from 'dotenv';

config();

export class EmailService {
  static SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
  static SENDGRID_USER_EMAIL = process.env.SENDGRID_USER_EMAIL || "chatbot@gmail.com";
  constructor() {
    sgMail.setApiKey(EmailService.SENDGRID_API_KEY);
  }

  public inviteUserEmail = async (details : { email: string, link: string }) => {
    const mailOptions = {
      from: EmailService.SENDGRID_USER_EMAIL,
      to: details.email,
      templateId: "abc",
      subject: 'Invitation to Chat Bot App',
      dynamic_template_data: { 
        email: details.email.split('@')[0],
        inviteLink: details.link
       },
    };
    try {
      await sgMail.send(mailOptions);
    } catch (e) {
      console.log(e.response.body, "Email Error");
    }
  };

}
