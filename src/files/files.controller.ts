import { Controller, Post, UseInterceptors, UploadedFile, Res, Param, Get, Body, Put, UseGuards, Req } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SearchImagesResponse, UpdateFileNameResponse, UploadResposeError, UploadResposeSuccess } from './responses/upload.responses';
import { UpdateFileNameDto, randomImagePostDTO } from './dto/upload-file.dto';
import { UploadFileFromUrlDto } from './dto/file.dto';

@ApiTags('Files')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Archivo a subir',
    type: 'multipart/form-data',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiOperation({ summary: 'Subir un archivo' })
  @ApiResponse({ status: 201, description: 'El archivo ha sido subido exitosamente.'})
  @ApiResponse({ status: 400, description: 'Los datos proporcionados son inválidos.'})
  @ApiResponse({ status: 500, description: 'Error interno del servidor.'})
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Req() req)  : Promise< UploadResposeSuccess | UploadResposeError> {
    try{
      const user_id: number = req.user.userId;
      const res = await this.filesService.uploadFile(file, user_id);
      
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

  @UseGuards(JwtAuthGuard)
  @Get('download/:key')
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Archivo descargado exitosamente.', type: Buffer})
  @ApiResponse({ status: 404, description: 'Archivo no encontrado.'})
  @ApiResponse({ status: 500, description: 'Error interno del servidor.'})
  async downloadFile(@Param('key') key: string, @Res() res: Response) : Promise< any | UploadResposeError> {
    try{
      const file = await this.filesService.downloadFile(key);
      res.setHeader('Content-Disposition', `attachment; filename=${file.file_name}`);
      res.setHeader('Content-Type', file.mimetype);
      return res.send(file.buffer as Buffer);
    }catch (error) {
      return {
        'success': false,
        'message': error.message
      }
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put('update/:key')
  @ApiBody({ description: 'Actualiza el nombre de un archivo', type: UpdateFileNameDto })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Nombre del archivo actualizado exitosamente.', type: UpdateFileNameResponse})
  @ApiResponse({ status: 400, description: 'Los datos proporcionados son inválidos.'})
  @ApiResponse({ status: 404, description: 'Archivo no encontrado.'})
  @ApiResponse({ status: 500, description: 'Error interno del servidor.'})
  async updateFileName(@Param('key') key: string, @Body() body: UpdateFileNameDto) : Promise< UpdateFileNameResponse | UploadResposeError> {
    try{
      const res = await this.filesService.updateFileName(key, body.file_name);
      return {
        'success': true,
        'data': res
      }
    }catch (error) {
      return {
        'success': false,
        'message': error.message
      }
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('upload/url')
  @ApiBearerAuth()
  @ApiBody({ description: 'Sube un archivo desde una URL', type: UploadFileFromUrlDto })
  @ApiResponse({ status: 201, description: 'Archivo subido exitosamente.', type: UpdateFileNameResponse})
  @ApiResponse({ status: 400, description: 'Los datos proporcionados son inválidos.'})
  @ApiResponse({ status: 500, description: 'Error interno del servidor.'})
  async uploadFileFromUrl(@Body() body: UploadFileFromUrlDto, @Req() req): Promise <  UpdateFileNameResponse | UploadResposeError > {
    try{
      const user_id: number = req.user.userId;
      const res = await this.filesService.uploadFileFromUrl(body.url, user_id);
      return {
        'success': true,
        'data': res
      }
    }catch (error) {
      return {
        'success': false,
        'message': error.message
      }
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('search/:key')
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Búsqueda de imágenes realizada exitosamente.', type: SearchImagesResponse})
  @ApiResponse({ status: 400, description: 'Los datos proporcionados son inválidos.'})
  @ApiResponse({ status: 500, description: 'Error interno del servidor.'})
  async searchImages(@Param('key') key: string) : Promise < SearchImagesResponse | UploadResposeError > {
    try{
      const res = await this.filesService.searchUnsplash(key);
      return {
        'success': true,
        'data': res
      }
    }catch (error) {
      return {
        'success': false,
        'message': error.message
      }
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('random/:key')
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Imagen aleatoria obtenida exitosamente.', type: SearchImagesResponse})
  @ApiResponse({ status: 400, description: 'Los datos proporcionados son inválidos.'})
  @ApiResponse({ status: 500, description: 'Error interno del servidor.'})
  async randomImage(@Param('key') key: string, @Res() res: Response):  Promise<any | UploadResposeError > {
    try{
      const file = await this.filesService.randomUnsplash(key);
      res.setHeader('Content-Disposition', `attachment; filename=${file.name}`);
      res.setHeader('Content-Type', file.mimetype);
      return res.send(file.buffer);
    }catch (error) {
      return {
        'success': false,
        'message': error.message
      }
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('random')
  @ApiBearerAuth()
  @ApiBody({ description: 'Sube un archivo desde una URL', type: randomImagePostDTO })
  @ApiResponse({ status: 201, description: 'Imagen aleatoria creada exitosamente.', type: SearchImagesResponse})
  @ApiResponse({ status: 400, description: 'Los datos proporcionados son inválidos.'})
  @ApiResponse({ status: 500, description: 'Error interno del servidor.'})
  async randomImagePost(@Body() body: randomImagePostDTO, @Req() req) : Promise<SearchImagesResponse | UploadResposeError > {
    try{
      const user_id: number = req.user.userId;
      const res = await this.filesService.uploadRandomUnsplashToS3(body.key, user_id);

      return {
        'success': true,
        'data': res
      }
    }catch (error) {
      return {
        'success': false,
        'message': error.message
      }
    }
  }
}
