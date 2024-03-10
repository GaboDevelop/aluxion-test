import { Body, ConflictException, Controller, InternalServerErrorException, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { ResetPasswordUserDto } from './dto/reset-user.dto';
import { ChangePasswordUserDto } from './dto/chage-password-user.dto';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RegisterResponseSuccess } from './responses/register.response';
import { AuthResponseError, LoginResponseSuccess, RefreshTokenResponse, ResetResponseSuccess } from './responses/login.response';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly  authService: AuthService,
    ) {}
    
    @Post('register')
    @ApiBody({ description: 'Registra un nuevo usuario', type: CreateUserDto })
    @ApiResponse({ status: 201, description: 'El usuario ha sido creado exitosamente.'})
    @ApiResponse({ status: 400, description: 'Los datos proporcionados son inválidos.', type: AuthResponseError})
    @ApiResponse({ status: 500, description: 'Error interno del servidor.'})
    async register(@Body() createUserDto: CreateUserDto) : Promise< RegisterResponseSuccess | AuthResponseError > {
        try {
            const res = await this.authService.signUp(createUserDto);
            
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

    @Post('login')
    @ApiBody({ description: 'Inicia sesión con un usuario existente', type: CreateUserDto })
    @ApiResponse({ status: 200, description: 'Inicio de sesión exitoso.', type: LoginResponseSuccess})
    @ApiResponse({ status: 400, description: 'Los datos proporcionados son inválidos.', type: AuthResponseError})
    @ApiResponse({ status: 500, description: 'Error interno del servidor.', type: AuthResponseError})
    async login(@Body() createUserDto: CreateUserDto) : Promise< LoginResponseSuccess | AuthResponseError > {
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

    @Post('refresh')
    @ApiBody({ description: 'Actualiza los tokens de acceso y actualización del usuario', type: RefreshTokenDto })
    @ApiResponse({ status: 200, description: 'Tokens actualizados exitosamente.', type: RefreshTokenResponse})
    @ApiResponse({ status: 400, description: 'Los datos proporcionados son inválidos.', type: AuthResponseError})
    @ApiResponse({ status: 500, description: 'Error interno del servidor.', type: AuthResponseError})
    async refresh(@Body() body: RefreshTokenDto) : Promise< RefreshTokenResponse | AuthResponseError > {
        try {
            const user = await this.authService.verifyRefreshToken(body.refresh_token);
            
            const res =  await this.authService.generateToken(user);

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
    @ApiBody({ description: 'Restablece la contraseña del usuario', type: ResetPasswordUserDto })
    @ApiResponse({ status: 200, description: 'Contraseña restablecida exitosamente. Se ha enviado un correo electrónico al usuario.', type: ResetResponseSuccess})
    @ApiResponse({ status: 400, description: 'Los datos proporcionados son inválidos.', type: AuthResponseError})
    @ApiResponse({ status: 500, description: 'Error interno del servidor.', type: AuthResponseError})
    async resetPassword(@Body() resetUserDto: ResetPasswordUserDto) : Promise< ResetResponseSuccess | AuthResponseError > {
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
    @ApiBody({ description: 'Cambia la contraseña del usuario', type: ChangePasswordUserDto })
    @ApiResponse({ status: 200, description: 'Contraseña cambiada exitosamente.', type: ResetResponseSuccess})
    @ApiResponse({ status: 400, description: 'Los datos proporcionados son inválidos.', type: AuthResponseError})
    @ApiResponse({ status: 500, description: 'Error interno del servidor.', type: AuthResponseError})
    async changePassword(@Body() changeUserDto: ChangePasswordUserDto) : Promise< ResetResponseSuccess | AuthResponseError > {
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
