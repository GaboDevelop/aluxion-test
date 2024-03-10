import { ApiProperty } from "@nestjs/swagger";

export class RefreshTokenDto {
    @ApiProperty({ description: 'El token de actualización del usuario' })
    refresh_token: string;   
}