import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateDeskReservationDto } from './dto/createReservations.dto';
import { UpdateDeskReservationDto } from './dto/updateReservation.dto';
import { IdResponseDto } from 'src/common/helpers/IdResponse.dto';
import { ApiResponse } from '@nestjs/swagger/dist/decorators/api-response.decorator';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { JwtPayload } from 'src/common/helpers/JwtPayload';

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Get(':officeId/desks/:deskId/reservations')
  async getDeskReservations(
    @Param('officeId') officeId: string,
    @Param('deskId') deskId: string,
  ) {
    const data = await this.reservationsService.getDeskReservations(
      officeId,
      deskId,
    );
    return { status: 'success', data };
  }

  @Post('/:officeId/:deskId')
  @ApiResponse({
    status: 200,
    description: 'Desk reservation created successfully',
    type: IdResponseDto,
  })
  @ApiOperation({ summary: 'Create a new desk reservation' })
  @ApiBody({ type: CreateDeskReservationDto })
  async makeDeskReservation(
    @Param('officeId') officeId: string,
    @Param('deskId') deskId: string,
    @Body() body: CreateDeskReservationDto,
  ) {
    return this.reservationsService.makeDeskReservation(body);
  }

  @Get(':officeId')
  // @ApiResponse({
  // status: 200,
  // description: 'Get my reservations successfully',
  // type: [getDeskReservationDto],
  @ApiOperation({ summary: 'Get my reservations' })
  async getMyReservations(
    @CurrentUser() user: JwtPayload,
    @Param('officeId') officeId: string,
  ) {
    return this.reservationsService.getMyReservations(user, officeId);
  }

  //   @Patch(':officeId/desks/:deskId/reservations/:reservationId')
  //   async updateDeskReservation(
  //     @Param('officeId') officeId: string,
  //     @Param('deskId') deskId: string,
  //     @Param('reservationId') reservationId: string,
  //     @Body() body: UpdateDeskReservationDto,
  //   ) {
  //     const data = await this.reservationsService.updateDeskReservation(
  //       officeId,
  //       deskId,
  //       reservationId,
  //       body,
  //     );
  //     return { status: 'success', data };
  //   }

  //   @Delete(':officeId/desks/:deskId/reservations/:reservationId')
  //   async deleteDeskReservation(
  //     @Param('officeId') officeId: string,
  //     @Param('deskId') deskId: string,
  //     @Param('reservationId') reservationId: string,
  //   ) {
  //     const data = await this.reservationsService.deleteDeskReservation(
  //       officeId,
  //       deskId,
  //       reservationId,
  //     );
  //     return { status: 'success', data };
  //   }

  //   @Get(':officeId/users/:userId/reservations')
  //   async getUserReservations(
  //     @Param('officeId') officeId: string,
  //     @Param('userId') userId: string,
  //   ) {
  //     const reservations = await this.reservationsService.getUserReservations(
  //       officeId,
  //       userId,
  //     );
  //     return { reservations };
  //   }
}
