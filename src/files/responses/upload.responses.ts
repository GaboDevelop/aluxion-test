import { ApiProperty } from "@nestjs/swagger";
import { FileDTO } from "../dto/file.dto";

export class UploadResposeSuccess {
    success: boolean;
    data: any
}

export class UploadResposeError {
    success: boolean;
    message: string;
}

export class DownloadFileResponse {
    file_name: string;
    mimetype: string;
    buffer: Buffer;
}

export class UpdateFileNameResponse {
    success: boolean;
    data: FileDTO;
}

export class SearchImagesResponse {
    success: boolean;
    data: any;
}