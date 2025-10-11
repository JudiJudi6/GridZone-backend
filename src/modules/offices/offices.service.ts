import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Office, OfficeDocument } from 'src/schemas/office.schema';
import { User } from 'src/schemas/user.schema';
import { CreateOrUpdateOfficeDto } from './dto/createOrUpdateOffice.dto';
import { JwtPayload } from 'src/common/helpers/JwtPayload';

@Injectable()
export class OfficeService {
  constructor(
    @InjectModel(Office.name)
    private readonly officeModel: Model<OfficeDocument>,

    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  async getAllOffices() {
    return this.officeModel.find();
  }

  async createOffice(user: JwtPayload, body: CreateOrUpdateOfficeDto) {
    const newOffice = new this.officeModel(body);
    const author = await this.userModel.findById(user.sub);
    newOffice.authorId = user.sub;
    await newOffice.save();

    if (author) {
      author.offices.push(newOffice._id.toString());
      await author.save();
    } else {
      throw new Error('how tf did u make an office with no account lol');
    }

    return newOffice._id;
  }

  async getUserOffices(userId: string) {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new Error('User not found');
    }
    const offices = await this.officeModel
      .find({ _id: { $in: user.offices } })
      .exec();

    return offices;
  }

  //do dodawania usera do biura przez kod zaproszenia trzeba dzialac po tablicy offices w userze

  //   async joinOfficeByCode(invCode: string, userId: string) {
  //     const officeToJoin = await getOfficeByInvCode(invCode);
  //     const userToJoin = await getUserById(userId);

  //     if (
  //       userToJoin &&
  //       officeToJoin &&
  //       !userToJoin.offices.includes(officeToJoin.id)
  //     ) {
  //       officeToJoin.users.push({
  //         name: userToJoin.name,
  //         surname: userToJoin.surname,
  //       });
  //       userToJoin.offices.push(officeToJoin.id);
  //       await userToJoin.save();
  //       await officeToJoin.save();
  //     } else {
  //       throw new Error(
  //         'No office with given invitation code or user already joined given office',
  //       );
  //     }

  //     return userToJoin;
  //   }

  //   async getOfficeById(id: string) {
  //     return OfficeModel.findOne({ id });
  //   }

  //   async patchDeskAvailability(
  //     officeId: string,
  //     deskId: string,
  //     active: boolean,
  //   ) {
  //     const filter = { id: officeId, 'deskList.deskId': deskId };
  //     const update = { $set: { 'deskList.$.active': active } };

  //     const desk = await OfficeModel.findOneAndUpdate(filter, update, {
  //       new: true,
  //     });
  //     if (!desk) throw new Error('No office with given ID');
  //     return desk;
  //   }
}
