import { Body, ConflictException, Controller, InternalServerErrorException, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { ResetPasswordUserDto } from './dto/reset-user.dto';
import { ChangePasswordUserDto } from './dto/chage-password-user.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly  authService: AuthService,
    ) {}

    @Post('login')
    async login(@Body() createUserDto: CreateUserDto) {
        try {
            const res = await this.authService.signIn(createUserDto);
            
            return {
                'success': true,
                'data': res
            }
        } catch (error) {
            return {
                'success': false,
                'message': error.message
            }
        }
        
    }

    @Post('reset-password')
    async resetPassword(@Body() resetUserDto: ResetPasswordUserDto) {
        try {
            const res = await this.authService.resetPassword(resetUserDto);
            
            return {
                'success': true,
                'data': res
            }
        } catch (error) {
            return {
                'success': false,
                'message': error.message
            }
        }
        
    }

    @Post('change-password')
    async changePassword(@Body() changeUserDto: ChangePasswordUserDto) {
        try {
            const res = await this.authService.changePassword(changeUserDto);
            
            return {
                'success': true,
                'data': res
            }
        } catch (error) {
            return {
                'success': false,
                'message': error.message
            }
        }
        
    }
}
