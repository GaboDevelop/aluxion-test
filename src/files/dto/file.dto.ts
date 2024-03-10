import { ApiProperty } from "@nestjs/swagger";

export class FileDTO{
    @ApiProperty({ description: 'Identificador' })
    id: number;
    @ApiProperty({ description: 'URL de bucket' })
    bucket_url: string;
    @ApiProperty({ description: 'Nombre de archivo' })
    file_name: string;
    @ApiProperty({ description: 'Key unico' })
    key: string;
    @ApiProperty({ description: 'MIMETYPE' })
    mimetype: string;
}

export class UploadFileFromUrlDto {
    @ApiProperty({ description: 'URL de imagen a subir' })
    url: string;
}