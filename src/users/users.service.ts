import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  public getAll(): Promise<User[]> {
    return this.prismaService.user.findMany();
  }
  public getById(id: User['id']): Promise<User | null> {
    return this.prismaService.user.findUnique({
      where: { id },
    });
  }

  public getByEmail(email: User['email']): Promise<User | null> {
    return this.prismaService.user.findUnique({
      where: { email },
      include: { password: true },
    });
  }

  public async create(
    userData: Omit<User, 'id' | 'role'>,
    password: string,
  ): Promise<User> {
    const { email } = userData;

    try {
      return await this.prismaService.user.create({
        data: {
          email,
          password: {
            create: {
              hashedPassword: password,
            },
          },
        },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new BadRequestException('not unique email');
      }
      throw error;
    }
  }

  public async updateById(
    id: User['id'],
    userData: Omit<User, 'id' | 'role'>,
    password?: string,
  ): Promise<User> {
    try {
      const existingUser = await this.prismaService.user.findUnique({
        where: { id },
      });

      if (!existingUser) {
        throw new NotFoundException('User not found');
      }

      if (password !== undefined) {
        return await this.prismaService.user.update({
          where: { id },
          data: {
            ...userData,
            password: {
              update: {
                hashedPassword: password,
              },
            },
          },
        });
      } else {
        return await this.prismaService.user.update({
          where: { id },
          data: {
            ...userData,
          },
        });
      }
    } catch (error) {
      throw new Error(`Error on user update: ${error.message}`);
    }
  }

  public deleteById(id: User['id']): Promise<User> {
    return this.prismaService.user.delete({
      where: { id },
    });
  }
}
