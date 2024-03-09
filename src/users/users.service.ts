import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { validateEmail } from 'src/utils/email';
import { FindUserDto } from './dto/find-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) : Promise<number | ConflictException > {
    const { email, password } = createUserDto;

    const existing_user = await this.userRepository.findOne({ where: { email } });

    if (existing_user) {
      throw new ConflictException('Email already in use');
    }

    const is_email_valid = validateEmail(email);
    if (!is_email_valid) {
      throw new ConflictException('Invalid email');
    }

    if (password.length < 8) {
      throw new ConflictException('Password must be at least 8 characters');
    }

    const password_hash = await bcrypt.hash(password, 10);

    const user = this.userRepository.create({
      email,
      password: password_hash,
    });

    // return id of the newly created user
    const { id } = await this.userRepository.save(user);
    return id;
  }

  findAll() {
    return `This action returns all users`;
  }

  async findOne(email: string) : Promise<FindUserDto | ConflictException> {
    const user:User = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new ConflictException('User not found');
    }

    return user
  }

  updateResetPasswordCode(id: number, reset_password_code: string) {
    return this.userRepository.update(id, { reset_password_code });
  }

  updatePassword(id: number, password: string) {
    const password_hash = bcrypt.hashSync(password, 10);
    return this.userRepository.update(id, { password: password_hash });
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
