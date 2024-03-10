import { ApiProperty } from "@nestjs/swagger";

export class ChangePasswordUserDto{
    @ApiProperty({ description: 'Email de restablecimiento' })
    email: string;
    @ApiProperty({ description: 'Nueva contraseña' })
    password: string;
    @ApiProperty({ description: 'Código recuperado en el correo' })
    code: string;
}