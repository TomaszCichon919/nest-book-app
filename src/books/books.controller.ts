import {
  Controller,
  Get,
  Param,
  Delete,
  Post,
  Put,
  Body,
  UseGuards,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { ParseUUIDPipe, NotFoundException } from '@nestjs/common';
import { CreateBookDTO } from './dtos/create-book.dto';
import { UpdateBookDTO } from './dtos/update-book.dto';
import { JwtAuthGuard } from '../auth/jws-auth.guard';
import { LikeBookDTO } from './dtos/like-book.dto';

@Controller('books')
export class BooksController {
  constructor(private booksService: BooksService) {}
  @Get('/')
  getAll(): any {
    return this.booksService.getAll();
  }

  @Get('/:id')
  async getById(@Param('id', new ParseUUIDPipe()) id: string) {
    const book = await this.booksService.getById(id);
    if (!book) throw new NotFoundException('Order not found');
    return book;
  }
  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  async deleteById(@Param('id', new ParseUUIDPipe()) id: string) {
    if (!this.booksService.getById(id))
      throw new NotFoundException('Order not found');
    await this.booksService.deleteById(id);
    return { success: true };
  }

  @Post('/')
  @UseGuards(JwtAuthGuard)
  create(@Body() bookData: CreateBookDTO) {
    return this.booksService.create(bookData);
  }

  @Put('/:id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() booksData: UpdateBookDTO,
  ) {
    if (!(await this.booksService.getById(id)))
      throw new NotFoundException('Order not found');

    await this.booksService.updateById(id, booksData);
    return { success: true };
  }

  @Post('/like')
  @UseGuards(JwtAuthGuard)
  async likeBook(@Body() likeData: LikeBookDTO): Promise<any> {
    try {
      await this.booksService.likeBook(likeData.bookId, likeData.userId);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}
