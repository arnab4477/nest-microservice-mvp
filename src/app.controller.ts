import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('/')
  async get() {
    return { messsage: 'the app is healthy and running!', version: process.env.npm_package_version };
  }
}
