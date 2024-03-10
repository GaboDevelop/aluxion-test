import { ApiProperty } from "@nestjs/swagger";

export class UpdateFileNameDto {
    @ApiProperty()
    file_name: string;
}

export class randomImagePostDTO {
    @ApiProperty({ description: 'Key de busqueda' })
    key: string;
}