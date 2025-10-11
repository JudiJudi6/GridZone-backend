import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { IdResponseDto } from 'src/common/helpers/IdResponse.dto';
import { JwtPayload } from 'src/common/helpers/JwtPayload';
import { CreateOrUpdateOfficeDto } from './dto/createOrUpdateOffice.dto';
import { OfficeService } from './offices.service';

@Controller('office')
// @UseGuards(JwtAuthGuard)
export class OfficeController {
  constructor(private readonly officeService: OfficeService) {}

  @Get('all')
  @ApiResponse({
    status: 200,
    description: 'Get all offices successfully',
    type: IdResponseDto,
  })
  @ApiOperation({ summary: 'Get all offices - DEV ONLY' })
  async getAllOffices() {
    return this.officeService.getAllOffices();
  }

  @Post()
  @ApiResponse({
    status: 200,
    description: 'Office created successfully',
    type: IdResponseDto,
  })
  @ApiOperation({ summary: 'Create a new office' })
  @ApiBody({ type: CreateOrUpdateOfficeDto })
  async createOffice(
    @CurrentUser() user: JwtPayload,
    @Body() createOfficeDto: CreateOrUpdateOfficeDto,
  ) {
    return this.officeService.createOffice(user, createOfficeDto);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Get all user offices successfully',
    type: [CreateOrUpdateOfficeDto],
  })
  @ApiOperation({ summary: 'Get all user offices' })
  async getUserOffices(@CurrentUser() user: JwtPayload) {
    return this.officeService.getUserOffices(user.sub);
  }
}
