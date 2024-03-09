import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async create(@Body() createUserDto: CreateUserDto) {
    try{
      const res = await this.usersService.create(createUserDto);
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
  @Get()
  async findAll() {
    try{
      const res = await this.usersService.findAll();
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
