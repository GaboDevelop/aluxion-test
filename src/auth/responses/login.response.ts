import { ApiProperty } from "@nestjs/swagger";

export class LoginResponseSuccess {
    @ApiProperty({ description: 'Indica si la operación fue exitosa' })
    success: boolean;
  
    @ApiProperty({ description: 'El token de acceso del usuario' })
    data: { access_token: string, refresh_token: string };
  }
  
export class AuthResponseError {
    @ApiProperty({ description: 'Indica si la operación fue exitosa' })
    success: boolean;

    @ApiProperty({ description: 'Mensaje de error' })
    message: string;
}

export class RefreshTokenResponse {
    @ApiProperty({ description: 'Indica si la operación fue exitosa' })
    success: boolean;

    @ApiProperty({ description: 'El token de acceso del usuario' })
    data: { access_token: string };
}

export class ResetResponseSuccess {
    @ApiProperty({ description: 'Indica si la operación fue exitosa' })
    success: boolean;

    @ApiProperty({ description: 'Mensaje de éxito' })
    data: string;
}