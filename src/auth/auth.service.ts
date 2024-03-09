import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { FindUserDto } from 'src/users/dto/find-user.dto';
import { MailService } from 'src/mail/mail.service';
import { ResetPasswordUserDto } from './dto/reset-user.dto';
import { ChangePasswordUserDto } from './dto/chage-password-user.dto';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtTokenService: JwtService,
        private mailService: MailService,
    ) {}

    async signIn(CreateUserDto): Promise<{ access_token: string }> {
        try {
            const { email, password } = CreateUserDto;
            
            const user: FindUserDto | ConflictException = await this.usersService.findOne(email);
            
            if (user instanceof ConflictException) {
                throw user;
            }
            
            
            if ( ! (await bcrypt.compare(password, user.password)) ) {
                throw new UnauthorizedException('Invalid credentials');
            }
            
            return {
                access_token: this.jwtTokenService.sign({ email: user.email, sub: user.id}),
            };
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
        
    }

    async resetPassword(resetPasswordUser : ResetPasswordUserDto): Promise<string> { 
        try {
            const { email } = resetPasswordUser;
            
            const user: FindUserDto | ConflictException = await this.usersService.findOne(email);
            
            if (user instanceof ConflictException) {
                throw user;
            }
            
            const code = Math.floor(100000 + Math.random() * 900000).toString();
            
            await this.usersService.updateResetPasswordCode(user.id, code);
            
            // send email
            await this.mailService.sendEmailResetPassword(email, code);
            
            return 'Code has been sent to your email';
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
        
    }

    async changePassword(changePassword : ChangePasswordUserDto): Promise<string> {
        try {
            const { email, password, code } = changePassword;
            
            const user: FindUserDto | ConflictException = await this.usersService.findOne(email);
            
            if (user instanceof ConflictException) {
                throw user;
            }
            
            if (user.reset_password_code !== code) {
                throw new UnauthorizedException('Code is not valid');
            }
            
            await this.usersService.updatePassword(user.id, password);
            
            return 'Password has been updated';
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
        
    }
}
