import { Type } from 'class-transformer';
import {
    IsNotEmpty,
    IsOptional,
    IsString,
    ValidateNested
} from 'class-validator';

class UserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  surname: string;
}

export class CreateDeskReservationDto {
  @IsString()
  @IsNotEmpty()
  officeId: string;

  @IsString()
  @IsNotEmpty()
  deskId: string;

  @IsString()
  @IsNotEmpty()
  reservationId: string;

  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => UserDto)
  user?: UserDto;

  @IsString()
  startTime: string;

  @IsString()
  endTime: string;

  @IsOptional()
  @IsString()
  createdAt?: string;
}
