import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { FindUserDto } from 'src/users/dto/find-user.dto';
import { MailService } from 'src/mail/mail.service';
import { ResetPasswordUserDto } from './dto/reset-user.dto';
import { ChangePasswordUserDto } from './dto/chage-password-user.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { validateEmail } from 'src/utils/email';
import { Integer } from 'aws-sdk/clients/apigateway';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtTokenService: JwtService,
        private mailService: MailService,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async signUp(createUserDto: CreateUserDto): Promise<Integer> {
        try {
            const { email, password } = createUserDto;

            const existing_user = await this.userRepository.findOne({ where: { email } });

            if (existing_user) {
            throw new ConflictException('Email already in use');
            }

            const is_email_valid = validateEmail(email);
            if (!is_email_valid) {
            throw new ConflictException('Invalid email');
            }

            if (password.length < 8) {
            throw new ConflictException('Password must be at least 8 characters');
            }

            const password_hash = await bcrypt.hash(password, 10);

            const user = this.userRepository.create({
            email,
            password: password_hash,
            });

            // return id of the newly created user
            const { id } = await this.userRepository.save(user);
            return id;
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    async signIn(CreateUserDto): Promise<{ access_token: string, refresh_token: string }> {
        try {
            const { email, password } = CreateUserDto;
            
            const user: FindUserDto | ConflictException = await this.usersService.findOne(email);
            
            if (user instanceof ConflictException) {
                throw user;
            }
            
            
            if ( ! (await bcrypt.compare(password, user.password)) ) {
                throw new UnauthorizedException('Invalid credentials');
            }
            
            const { access_token } = await this.generateToken(user); 
            const { refresh_token } = await this.generateRefreshToken(user);

            return { 
                access_token,
                refresh_token
            };
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    async verifyRefreshToken(refresh_token: string): Promise<FindUserDto> {
        try {
            console.log("Process", process.env.REFRESH_SECRET_OAUTH)
            const token = this.jwtTokenService.verify(refresh_token, { 
                secret: process.env.REFRESH_SECRET_OAUTH,
            });

            return token;
        } catch (error) {
            throw new UnauthorizedException('Invalid token');
        }
    }

    async generateToken(user: FindUserDto): Promise<{ access_token: string; }> {
        try {
            const access_token = this.jwtTokenService.sign(
                { email: user.email, sub: user.id},
                {
                    secret: process.env.SECRET_OAUTH,
                    expiresIn: '15m',
                })
            return { access_token };
        }catch(error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    async generateRefreshToken(user: FindUserDto): Promise<{ refresh_token: string }> {
        try {
            const refresh_token = this.jwtTokenService.sign(
                { email: user.email, sub: user.id},
                {
                    secret: process.env.REFRESH_SECRET_OAUTH,
                    expiresIn: '1d',
                }
            );

            return { refresh_token };
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
