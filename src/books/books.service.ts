import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Book } from '@prisma/client';

@Injectable()
export class BooksService {
  constructor(private prismaService: PrismaService) {}

  public getAll(): Promise<Book[]> {
    return this.prismaService.book.findMany({
      include: { author: true },
    });
  }

  public getById(id: Book['id']): Promise<Book | null> {
    return this.prismaService.book.findUnique({
      where: { id },
      include: { author: true },
    });
  }

  public deleteById(id: Book['id']): Promise<Book> {
    return this.prismaService.book.delete({
      where: { id },
    });
  }

  public async create(
    orderData: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Book> {
    const { authorId, ...otherData } = orderData;
    try {
      return await this.prismaService.book.create({
        data: {
          ...otherData,
          author: {
            connect: { id: authorId },
          },
        },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new BadRequestException("Book doesn't exist");
      } else if (error.code === 'P2025') {
        throw new BadRequestException("Book doesn't exist");
      }
      throw error;
    }
  }

  public updateById(
    id: Book['id'],
    orderData: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Book> {
    const { authorId, ...otherData } = orderData;
    return this.prismaService.book.update({
      where: { id },
      data: {
        ...otherData,
        author: {
          connect: { id: authorId },
        },
      },
    });
  }

  async likeBook(bookId: string, userId: string): Promise<any> {
    try {
      const likedBook = await this.prismaService.book.update({
        where: { id: bookId },
        data: {
          users: {
            create: {
              user: {
                connect: { id: userId },
              },
            },
          },
        },
      });

      if (!likedBook) {
        throw new NotFoundException('Book not found');
      }

      return likedBook;
    } catch (error) {
      throw new Error(`Error liking the book: ${error.message}`);
    }
  }
}
