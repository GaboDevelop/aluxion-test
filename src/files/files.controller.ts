import { Controller, Post, UseInterceptors, UploadedFile, Res, Param, Get, Body, Put } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    try{
      const res = await this.filesService.uploadFile(file);
      
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

  //download file by key
  @Get('download/:key')
  async downloadFile(@Param('key') key: string, @Res() res: Response) {
    try{
      const file = await this.filesService.downloadFile(key);
      res.setHeader('Content-Disposition', `attachment; filename=${file.file_name}`);
      res.setHeader('Content-Type', file.mimetype);
      return res.send(file.buffer);
    }catch (error) {
      return {
        'success': false,
        'message': error.message
      }
    }
  }

  //update file name by key
  @Put('update/:key')
  async updateFileName(@Param('key') key: string, @Body() body: {file_name: string}) {
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

  //upload file from url
  @Post('upload/url')
  async uploadFileFromUrl(@Body() body: {url: string}) {
    try{
      const res = await this.filesService.uploadFileFromUrl(body.url);
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

  @Get('search/:key')
  async searchImages(@Param('key') key: string) {
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

  @Get('random/:key')
  async randomImage(@Param('key') key: string, @Res() res: Response) {
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

  @Post('random')
  async randomImagePost(@Body() body: {key: string}) {
    try{
      const res = await this.filesService.uploadRandomUnsplashToS3(body.key);

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
