import {createTransport} from 'nodemailer'
import type SMTPTransport from 'nodemailer/lib/smtp-transport';
import {useRuntimeConfig} from '#imports';
import { H3Event } from 'h3';
import {UserDataDocument} from "~/server/document-models/UserDataDocument";

class EmailService {
  transport;
  nodemailerConfig: SMTPTransport.Options;

  constructor(event: H3Event) {
    const config = useRuntimeConfig(event);
    console.log('EmailService.constructor() config.nodemailer: ', config.nodemailer);
    this.nodemailerConfig = config.nodemailer;
    this.transport = createTransport({
      ...config.nodemailer,
      // Use for testing. https://nodemailer.com/transports/stream
      // streamTransport: true,
      // buffer: true,
    });
  }

  async sendMail(options: SMTPTransport.MailOptions) {
    return this.transport.sendMail({
      from: this.nodemailerConfig.from,
      ...options
    })
  }

  async sendVerificationEmail(userDataDocument: UserDataDocument) {
    console.log('EmailService.verifyVerificationEmail() userDataDocument.emailInfo: ', userDataDocument.emailInfo);
    const verificationToken = await userDataDocument.generateVerificationToken();
    console.log('EmailService.verifyVerificationEmail() verificationToken: ', verificationToken);
    const mailResponse =  await this.sendMail({
      subject: 'Welcome to In Dire Straits!',
      text: `Please verify your email address by loading this URL in your browser: https://localhost:3000/user/verify/${verificationToken.token}`,
      to: userDataDocument.emailInfo.email
    });
    console.log('EmailService.verifyVerificationEmail() mailResponse: ', mailResponse);
    return mailResponse;
  }
}

export function useEmailService(event: H3Event) {

  const emailService = new EmailService(event);

  return emailService;
}