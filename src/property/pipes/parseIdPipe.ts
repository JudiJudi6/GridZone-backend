import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ParseIdPipe implements PipeTransform<string, number> {
  transform(value: string): number {
    const val = parseInt(value, 10);
    if (isNaN(val)) {
      throw new BadRequestException('Id must be a number');
    }
    if (val < 0) {
      throw new BadRequestException('Id must be a positive number');
    }
    return val;
  }
}
