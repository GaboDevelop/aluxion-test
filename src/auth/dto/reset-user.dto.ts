import { ApiProperty } from "@nestjs/swagger";

export class ResetPasswordUserDto{
    @ApiProperty({ description: 'Email de restablecimiento' })
    email: string;
}