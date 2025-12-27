import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Office, OfficeDocument } from 'src/schemas/office.schema';
import { User } from 'src/schemas/user.schema';
import { CreateDeskReservationDto } from './dto/createReservations.dto';
import { UpdateDeskReservationDto } from './dto/updateReservation.dto';
import { JwtPayload } from 'src/common/helpers/JwtPayload';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectModel(Office.name)
    private readonly officeModel: Model<OfficeDocument>,

    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  private parseAndValidateDates(
    startIso: string,
    endIso: string,
    now = new Date(),
  ) {
    const start = new Date(startIso);
    const end = new Date(endIso);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      throw new BadRequestException(
        'Invalid date format. Please use ISO format.',
      );
    }
    if (start >= end) {
      throw new BadRequestException(
        'Incorrect date range, please use the correct one',
      );
    }
    if (start < now) {
      throw new BadRequestException('Cannot use a past date');
    }

    return { start, end };
  }

  private overlaps(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date) {
    return aStart < bEnd && aEnd > bStart;
  }

  async getDeskReservations(officeId: string, deskId: string) {
    const office = await this.officeModel.findOne({
      id: officeId,
      'deskList.deskId': deskId,
    });

    if (!office) throw new NotFoundException('No office with given ID');

    const desk = office.deskList.find((d) => d.deskId === deskId);
    if (!desk)
      throw new NotFoundException('No desk with given ID in this office');

    return desk.reservationData ?? [];
  }

  async makeDeskReservation(dto: CreateDeskReservationDto) {
    const office = await this.officeModel.findOne({
      id: dto.officeId,
      'deskList.deskId': dto.deskId,
    });

    if (!office) throw new NotFoundException('No office with given ID');

    const desk = office.deskList.find((d) => d.deskId === dto.deskId);
    if (!desk)
      throw new NotFoundException('No desk with given ID in this office');

    const reservations = desk.reservationData;
    const { start: newStart, end: newEnd } = this.parseAndValidateDates(
      dto.startTime,
      dto.endTime,
    );

    for (const r of reservations) {
      const rStart = new Date(r.startTime);
      const rEnd = new Date(r.endTime);

      if (this.overlaps(newStart, newEnd, rStart, rEnd)) {
        throw new BadRequestException(
          'Date range is already taken, please try another one',
        );
      }
    }

    reservations.push(dto as any);
    await office.save();

    return dto.reservationId;
  }

  //   async updateDeskReservation(
  //     officeId: string,
  //     deskId: string,
  //     reservationId: string,
  //     dto: UpdateDeskReservationDto,
  //   ) {
  //     const office = await this.officeModel.findOne({
  //       id: officeId,
  //       'deskList.deskId': deskId,
  //       'deskList.reservationData.reservationId': reservationId,
  //     });

  //     if (!office) throw new NotFoundException('No office with given ID');

  //     const desk = office.deskList.find((d) => d.deskId === deskId);
  //     if (!desk)
  //       throw new NotFoundException('No desk with given ID in this office');

  //     const reservations = desk.reservationData;
  //     const target = reservations.find((r) => r.reservationId === reservationId);
  //     if (!target)
  //       throw new NotFoundException('No reservation with given ID in this desk');

  //     const { start: newStart, end: newEnd } = this.parseAndValidateDates(
  //       dto.startTime,
  //       dto.endTime,
  //     );

  //     for (const r of reservations) {
  //       if (r.reservationId === reservationId) continue;

  //       const rStart = new Date(r.startTime);
  //       const rEnd = new Date(r.endTime);

  //       if (this.overlaps(newStart, newEnd, rStart, rEnd)) {
  //         throw new BadRequestException(
  //           'Date range is already taken, please try another one',
  //         );
  //       }
  //     }

  //     target.startTime = new Date(dto.startTime);
  //     target.endTime = new Date(dto.endTime);

  //     await office.save();
  //     return target;
  //   }

  //   async deleteDeskReservation(
  //     officeId: string,
  //     deskId: string,
  //     reservationId: string,
  //   ) {
  //     const office = await this.officeModel.findOne({
  //       id: officeId,
  //       'deskList.deskId': deskId,
  //       'deskList.reservationData.reservationId': reservationId,
  //     });

  //     if (!office) throw new NotFoundException('No office with given ID');

  //     const desk = office.deskList.find((d) => d.deskId === deskId);
  //     if (!desk)
  //       throw new NotFoundException('No desk with given ID in this office');

  //     const idx = desk.reservationData.findIndex(
  //       (r) => r.reservationId === reservationId,
  //     );
  //     if (idx === -1)
  //       throw new NotFoundException('No reservation with given ID in this desk');

  //     desk.reservationData.splice(idx, 1);
  //     await office.save();

  //     return desk.reservationData;
  //   }

  async getMyReservations(user: JwtPayload, officeId: string) {
    if (!officeId || !user.sub) {
      throw new BadRequestException('Office ID and User ID are required');
    }

    const office = await this.officeModel.findOne({ id: officeId });
    if (!office) throw new NotFoundException('Office not found');

    const out: any[] = [];

    for (const desk of office.deskList ?? []) {
      for (const r of desk.reservationData ?? []) {
        if (r.userId === user.sub) {
          out.push({
            user: r.user,
            reservationId: r.reservationId,
            userId: r.userId,
            startTime: r.startTime,
            endTime: r.endTime,
            createdAt: r.createdAt,
            // _id: r._id,
            deskId: desk.deskId,
            deskName: desk.deskName,
          });
        }
      }
    }

    return out;
  }
}
