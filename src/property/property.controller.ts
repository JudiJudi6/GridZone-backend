import {
  Body,
  Controller,
  Get,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreatePropertyDto } from './dto/createProperty.dto';
import {
  createPropertySchema,
  CreatePropertyZodDto,
} from './dto/createPropertyZod.dto';
import { HeadersDto } from './dto/headers.dto';
import { ParseIdPipe } from './pipes/parseIdPipe';
import { RequestHeader } from './pipes/request-header';
import { ZodValidationPipe } from './pipes/zodValidationPipe';
import { PropertyService } from './property.service';

@Controller('property')
export class PropertyController {
  propertyService: PropertyService;
  constructor() {
    this.propertyService = new PropertyService();
  }

  @Get()
  findAll() {
    this.propertyService.findAll();
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id,
    @Query('isActive', ParseBoolPipe) isActive,
  ) {
    return { id, isActive };
  }

  @Post()
  @UsePipes(new ZodValidationPipe(createPropertySchema))
  createProperty(
    @Body()
    body: CreatePropertyZodDto,
  ) {
    return body;
  }

  @Patch(':id')
  updateProperty(
    @Param('id', ParseIdPipe) id,
    @Body()
    body: CreatePropertyDto,
    @RequestHeader(new ValidationPipe({ validateCustomDecorators: true }))
    header: HeadersDto,
  ) {
    return header;
  }
}
