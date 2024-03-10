import { ApiProperty } from "@nestjs/swagger";

export class RegisterResponseSuccess {
    @ApiProperty({ description: 'Indica si la operación fue exitosa' })
    success: boolean;

    @ApiProperty({ description: 'En caso de éxito, retorna el ID del usuario creado' })
    data: number;

}