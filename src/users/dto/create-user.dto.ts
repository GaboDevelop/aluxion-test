import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
    @ApiProperty({ description: 'El correo electrónico del usuario' })
    email: string | null;
    @ApiProperty({ description: 'La contraseña del usuario' })
    password: string | null;
}
