import { Injectable } from '@nestjs/common';
import { CreateFileDto } from './dto/create-file.dto';
import * as AWS from 'aws-sdk';
import { InjectRepository } from '@nestjs/typeorm';
import { FileAws } from './entities/file.entity';
import { Repository } from 'typeorm';
import fetch from 'node-fetch';
import { getFileNameAndMime, getMimeType } from 'src/utils/file';
import { createApi } from 'unsplash-js';
import { ConfigService } from '@nestjs/config';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class FilesService {
  private AWS_S3_BUCKET: string = '';
  private S3:AWS.S3  = new AWS.S3();

  private unsplash = createApi({
    accessKey: '',
    fetch: fetch
  })

  constructor(
    @InjectRepository(FileAws)
    private readonly fileRepository: Repository<FileAws>,
  ){
    this.AWS_S3_BUCKET = process.env.S3_BUCKET;
    this.S3 = new AWS.S3({
      accessKeyId: process.env.S3_KEY_ID,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY_ID,
    });


    this.unsplash = createApi({
      accessKey: process.env.UNSPLASH_ACCESS_KEY,
      fetch: fetch.default
    });
  }

  async uploadFile(file: Express.Multer.File, user_id: number){
    try{
      const { originalname } = file;

      const res =  await this.s3Upload(
        file.buffer,
        this.AWS_S3_BUCKET,
        originalname,
        file.mimetype,
      );

      const fileData: CreateFileDto = {
        bucket_url: res.Location,
        file_name: originalname,
        key: res.Key,
        mimetype: file.mimetype,
        user_id: user_id
      };

      const newFile = await this.fileRepository.create(fileData);

      return await this.fileRepository.save(newFile);

    }catch (error) {
      throw new Error(error.message);
    }
    



    
  }

  async downloadFile(key: string){
    try{
      const file = await this.fileRepository.findOne({ where: { key } });

      const params = {
        Bucket: this.AWS_S3_BUCKET,
        Key: key,
      };

      const s3_res = await this.S3.getObject(params).promise();

      return {
        file_name: file.file_name,
        buffer: s3_res.Body,
        mimetype: s3_res.ContentType,
      }

    }catch (error) {
      throw new Error(error.message);
    }
  }

  // update file name in database and in s3
  async updateFileName(key: string, file_name: string){
    try{
      const file = await this.fileRepository.findOne({ where: { key } });

      if (!file) {
        throw new Error('File not found');
      }

      const previus_key = file.key;

      const params = {
        Bucket: this.AWS_S3_BUCKET,
        Key: String(file_name),
        CopySource: file.bucket_url,
        ContentType: file.mimetype,
        MetadataDirective: 'REPLACE',
        Metadata: {
          file_name,
        },
      };

      await this.S3.copyObject(params).promise();

      await this.fileRepository.update(
        { key }, 
        { 
          file_name, 
          updated_at: new Date(), 
          key: String(file_name), 
          bucket_url: `https://${this.AWS_S3_BUCKET}.s3.amazonaws.com/${file_name}`
        }
      );
      

      // TODO: AccessDenied for deleteObject
      // const deleteParams = {
      //   Bucket: this.AWS_S3_BUCKET,
      //   Key: previus_key,
      // };
      
      // const res = await this.S3.deleteObject(deleteParams).promise();
        
      const updatedFileData = await this.fileRepository.findOne({ where: { key: String(file_name) } });
      return {
        id: updatedFileData.id,
        bucket_url: updatedFileData.bucket_url,
        file_name: updatedFileData.file_name,
        key: updatedFileData.key,
        mimetype: updatedFileData.mimetype
      }

    }catch (error) {
      throw new Error(error.message);
    }
  }

  async downloadFileUrl(url: string) {
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();
    return Buffer.from(buffer);
  }

  async uploadFileFromUrl(url: string, user_id: number){
    try{
      const buffer = await this.downloadFileUrl(url);
      const { name, mimetype } = getFileNameAndMime(url);

      const res =  await this.s3Upload(
        buffer,
        this.AWS_S3_BUCKET,
        name,
        mimetype
      );

      const fileData: CreateFileDto = {
        bucket_url: res.Location,
        file_name: name,
        key: res.Key,
        mimetype: mimetype,
        user_id
      };

      const newFile = await this.fileRepository.create(fileData);

      return await this.fileRepository.save(newFile);

    }catch (error) {
      throw new Error(error.message);
    }
  }

  async s3Upload(file, bucket, name, mimetype) {
    const params = {
      Bucket: bucket,
      Key: String(name),
      Body: file,
      ACL: 'public-read',
      ContentType: mimetype,
      ContentDisposition: 'inline',
      CreateBucketConfiguration: {
        LocationConstraint: 'ap-south-1',
      },
    };

    try {
      let s3_res = await this.S3.upload(params).promise();
      return s3_res;
    } catch (e) {
      console.log(e);
    }
  }

  async searchUnsplash(query: string){
    try{
      const res = await this.unsplash.search.getPhotos({
        query,
        page: 1,
        perPage: 10,
      });
      return res.response;
    }catch (error) {
      throw new Error(error.message);
    }
  }

  async randomUnsplash(query: string){
    try{
      const res = await this.unsplash.photos.getRandom({
        count: 1,
        query,
      })
      if (res.errors) {
        throw new Error(res.errors[0]);
      }

      if(Array.isArray(res.response) && res.response.length > 0){
        const photo = res.response[0];
        const { regular } = photo.urls;
        const name = photo.id;
        const buffer = await this.downloadFileUrl(regular);
        const mimetype = getMimeType('.jpg');
        return {
          buffer,
          name,
          mimetype: mimetype
        };
      }

      throw new Error('No photo found');
    }catch (error) {
      throw new Error(error.message);
    }
  }

  async uploadRandomUnsplashToS3(query: string, user_id: number){
    try{
      const file = await this.randomUnsplash(query);
      const res =  await this.s3Upload(
        file.buffer,
        this.AWS_S3_BUCKET,
        file.name,
        file.mimetype
      );

      const fileData: CreateFileDto = {
        bucket_url: res.Location,
        file_name: file.name,
        key: res.Key,
        mimetype: file.mimetype,
        user_id
      };

      const newFile = await this.fileRepository.create(fileData);

      return await this.fileRepository.save(newFile);

    }catch (error) {
      throw new Error(error.message);
    }
  }
}
