import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Office, OfficeSchema } from 'src/schemas/office.schema';
import { User, UserSchema } from 'src/schemas/user.schema';
import { ReservationsController } from './reservations.controller';
import { ReservationsService } from './reservations.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Office.name, schema: OfficeSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [ReservationsController],
  providers: [ReservationsService],
})
export class ReservationsModule {}
