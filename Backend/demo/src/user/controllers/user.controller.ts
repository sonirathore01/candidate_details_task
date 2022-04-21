import {
  Body,
  Controller, Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { query } from 'express';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(201)
  public async create(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }

  @Patch('/:userId')
  @HttpCode(200)
  public async update(
    @Param('userId') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(userId, updateUserDto);
  }

  @Get()
  @HttpCode(200)
  public async list(@Query() query:any) {
    return this.userService.list(query);
  }

  @Delete('/:userId')
  @HttpCode(200)
  public async delete(@Param('userId') userId : any) {
    return this.userService.delete(userId);
  }
}
