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
    UsePipes
} from '@nestjs/common';
import { CreatePropertyDto } from './dto/createProperty.dto';
import {
    createPropertySchema,
    CreatePropertyZodDto,
} from './dto/createPropertyZod.dto';
import { ParseIdPipe } from './pipes/parseIdPipe';
import { ZodValidationPipe } from './pipes/zodValidationPipe';

@Controller('property')
export class PropertyController {
  @Get()
  getProperty(): string {
    return 'This action returns all properties';
  }

  @Get(':id')
  getPropertyById(
    @Param('id', ParseIntPipe) id,
    @Query('sort', ParseBoolPipe) sort,
  ): string {
    console.log(typeof sort);
    return id;
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
  ) {
    return body;
  }
}
