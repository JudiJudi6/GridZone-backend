import { Module } from '@nestjs/common';
import { OfficeController } from './offices.controller';
import { OfficeService } from './offices.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Office, OfficeSchema } from 'src/schemas/office.schema';
import { User, UserSchema } from 'src/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Office.name, schema: OfficeSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [OfficeController],
  providers: [OfficeService],
})
export class OfficeModule {}
