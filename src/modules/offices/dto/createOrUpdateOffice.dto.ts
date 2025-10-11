import {
  IsString,
  IsOptional,
  IsArray,
  IsBoolean,
  ValidateNested,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class DeskRenderDataDto {
  @ApiPropertyOptional() @IsOptional() @IsString() deskPath?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() deskName?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() equipPath?: string;
  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  equipment?: string[];
  @ApiPropertyOptional() @IsOptional() @IsString() id?: string;
  @ApiPropertyOptional() @IsOptional() rotX?: number;
  @ApiPropertyOptional() @IsOptional() rotY?: number;
  @ApiPropertyOptional() @IsOptional() rotZ?: number;
  @ApiPropertyOptional() @IsOptional() scale?: number;
  @ApiPropertyOptional({ enum: ['static', 'desk'] }) @IsOptional() type?:
    | 'static'
    | 'desk';
  @ApiPropertyOptional() @IsOptional() x?: number;
  @ApiPropertyOptional() @IsOptional() y?: number;
  @ApiPropertyOptional() @IsOptional() z?: number;
}

export class FloorRenderDataDto {
  @ApiPropertyOptional() @IsOptional() @IsString() color?: string;
  @ApiPropertyOptional() @IsOptional() endX?: number;
  @ApiPropertyOptional() @IsOptional() endY?: number;
  @ApiPropertyOptional() @IsOptional() endZ?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() id?: string;
  @ApiPropertyOptional() @IsOptional() x?: number;
  @ApiPropertyOptional() @IsOptional() y?: number;
  @ApiPropertyOptional() @IsOptional() z?: number;
}

export class ElementRenderDataDto {
  @ApiPropertyOptional() @IsOptional() @IsString() id?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() path?: string;
  @ApiPropertyOptional() @IsOptional() rotX?: number;
  @ApiPropertyOptional() @IsOptional() rotY?: number;
  @ApiPropertyOptional() @IsOptional() rotZ?: number;
  @ApiPropertyOptional() @IsOptional() scale?: number;
  @ApiPropertyOptional({ enum: ['static', 'desk'] }) @IsOptional() type?:
    | 'static'
    | 'desk';
  @ApiPropertyOptional() @IsOptional() x?: number;
  @ApiPropertyOptional() @IsOptional() y?: number;
  @ApiPropertyOptional() @IsOptional() z?: number;
}

export class WallRenderDataDto {
  @ApiPropertyOptional() @IsOptional() @IsString() color?: string;
  @ApiPropertyOptional() @IsOptional() endX?: number;
  @ApiPropertyOptional() @IsOptional() endY?: number;
  @ApiPropertyOptional() @IsOptional() endZ?: number;
  @ApiPropertyOptional() @IsOptional() transparent?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsString() id?: string;
  @ApiPropertyOptional() @IsOptional() x?: number;
  @ApiPropertyOptional() @IsOptional() y?: number;
  @ApiPropertyOptional() @IsOptional() z?: number;
}

export class OfficeRenderDataDto {
  @ApiProperty({ type: [DeskRenderDataDto] })
  @ValidateNested({ each: true })
  @Type(() => DeskRenderDataDto)
  desks: DeskRenderDataDto[];

  @ApiPropertyOptional({ type: [FloorRenderDataDto] })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => FloorRenderDataDto)
  floor?: FloorRenderDataDto[];

  @ApiPropertyOptional({ type: [ElementRenderDataDto] })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ElementRenderDataDto)
  elements?: ElementRenderDataDto[];

  @ApiPropertyOptional({ type: [WallRenderDataDto] })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => WallRenderDataDto)
  walls?: WallRenderDataDto[];
}

export class ReservationDataDto {
  @ApiPropertyOptional() @IsOptional() @IsString() reservationId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() userId?: string;
  @ApiPropertyOptional({
    type: 'object',
    example: { name: 'Jan', surname: 'Kowalski' },
    additionalProperties: true,
  })
  @IsOptional()
  @IsObject()
  user?: { name?: string; surname?: string };
  @ApiPropertyOptional() @IsOptional() startTime?: Date;
  @ApiPropertyOptional() @IsOptional() endTime?: Date;
  @ApiPropertyOptional() @IsOptional() createdAt?: Date;
}

export class DeskDto {
  @ApiProperty() @IsString() deskId: string;
  @ApiProperty() @IsString() deskName: string;
  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  equipment: string[];

  @ApiPropertyOptional({ type: [ReservationDataDto] })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ReservationDataDto)
  reservationData?: ReservationDataDto[];

  @ApiPropertyOptional() @IsOptional() @IsBoolean() active?: boolean;
}

export class CreateOrUpdateOfficeDto {
  @ApiPropertyOptional() @IsOptional() @IsString() id?: string;
  @ApiProperty() @IsString() name: string;
  @ApiProperty() @IsString() address: string;

  @ApiProperty({ type: OfficeRenderDataDto })
  @ValidateNested()
  @Type(() => OfficeRenderDataDto)
  renderData: OfficeRenderDataDto;

  @ApiProperty({ type: [DeskDto] })
  @ValidateNested({ each: true })
  @Type(() => DeskDto)
  deskList: DeskDto[];

  @ApiPropertyOptional() @IsOptional() @IsString() authorId?: string;

  @ApiPropertyOptional({
    type: 'array',
    example: [{ name: 'Jan', surname: 'Kowalski' }],
  })
  @IsOptional()
  @IsArray()
  users?: { name: string; surname: string }[];

  @ApiProperty() @IsString() invitationCode: string;
}
