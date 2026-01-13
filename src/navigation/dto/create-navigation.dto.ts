import { IsNotEmpty, IsString } from 'class-validator';

export class CreateNavigationDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  slug: string;
}
