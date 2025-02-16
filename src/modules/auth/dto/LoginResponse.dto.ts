import { User } from 'src/schemas/user.schema';
import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty({
    description: 'JWT access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  access_token: string;

  @ApiProperty({
    description: 'User data without password',
    example: {
      id: '507f1f77bcf86cd799439011',
      email: 'user@example.com',
      name: 'John',
      surname: 'Doe',
    },
  })
  user: Omit<User, 'password'>;
}
