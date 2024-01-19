/* eslint-disable */
import { IsUUID, IsNotEmpty } from 'class-validator';

export class LikeBookDTO {
  @IsUUID()
  @IsNotEmpty()
  bookId: string;

  @IsUUID()
  @IsNotEmpty()
  userId: string;
}