import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { env } from './utils/env/env';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './utils/errors/validation-error';

@Module({
  imports: [UserModule, MongooseModule.forRoot(env.db.url)],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
