import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import nodemailer from 'nodemailer';


@Injectable()
export class MailService {
    constructor(private readonly mailerService: MailerService) {}
    
    
    async sendEmailResetPassword(email:string, code:string) {
        try{
    
            const res = await this.mailerService.sendMail({
                from: '"ALUXION" <from@example.com>',
                to: email,
                subject: 'Reset Password',
                text: 'Hey there, this is your code to reset your password: ' + code,
                html: '<b>Hey there! </b><br> This is your code to reset your password: <b>' + code + '</b>',// HTML body content
            })

            return res;
            
        }catch(e){
            throw new Error(e);
        }
       
        
    }
}
