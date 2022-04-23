import {
  Body,
  Controller, 
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  UseFilters,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { HttpExceptionFilter } from '../services/http-exception.filter';


@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseFilters(new HttpExceptionFilter())
  @HttpCode(201)
  public async create(@Body() createUserDto: CreateUserDto) {
    const data = await this.userService.create(createUserDto);
    return data;
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

  @Post('/delete')
  @HttpCode(201)
  public async deleteMany(@Body() data: string[]) {
    return await this.userService.deleteMany(data["ids"]);
  }
}
