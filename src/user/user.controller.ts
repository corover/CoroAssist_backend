import {
  Controller,
  Get,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UserService } from './user.service';
import { FileInterceptor } from '@nestjs/platform-express';


@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/sendQuery')
  async sendQuery(@Body() body): Promise<any> {
    return await this.userService.sendQuery(body);
  }


  @Post('/fileUpload')
  @UseInterceptors(FileInterceptor('file'))
  async fileUpload(
    @Body() body,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<any> {
    return await this.userService.fileUpload(body, file);
  }
}
