import { Module } from '@nestjs/common';
import { PropertyController } from './property.controller';

@Module({
  controllers: [PropertyController],
  // providers: [
  //   {
  //     provide: APP_PIPE,
  //     useValue: new ValidationPipe({
  //       whitelist: true,
  //       forbidNonWhitelisted: true,
  //       transform: true,
  //       transformOptions: { enableImplicitConversion: true },
  //     }),
  //   },
  // ],
})
export class PropertyModule {}
