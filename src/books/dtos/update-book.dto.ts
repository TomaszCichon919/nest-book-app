/* eslint-disable */
import { IsNotEmpty, IsString, IsUUID, IsInt } from 'class-validator';

export class UpdateBookDTO {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsInt()
  rating: number;

  @IsNotEmpty()
  @IsInt()
  price: number;

  @IsNotEmpty()
  @IsString()
  @IsUUID()
  authorId: string;
}
