import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Repository } from 'typeorm';
import { Book } from './entities/book.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book) private readonly bookRepository: Repository<Book>,
  ) {}
  async create(createBookDto: CreateBookDto) {
    const existingBook = await this.bookRepository.findOne({
      where: {
        title: createBookDto.title,
      },
    });
    if (existingBook) {
      throw new ConflictException('This book already exist in the system');
    }
    const book = this.bookRepository.create(createBookDto);
    return await this.bookRepository.save(book);
  }

  async findAll() {
    return await this.bookRepository.find();
  }

  async findOne(id: number) {
    const book = await this.bookRepository.findOne({ where: { id } });
    if (!book) {
      throw new NotFoundException('This Book is not found in the system');
    }
    return book;
  }

  async update(id: number, updateBookDto: UpdateBookDto) {
    const book = await this.bookRepository.preload({
      id,
      ...updateBookDto,
    });
    if (!book) {
      throw new NotFoundException('Book with this id is not found to update');
    }
    return await this.bookRepository.save(book);
  }

  async remove(id: number) {
    const book = await this.bookRepository.findOne({ where: { id } });
    if (!book) {
      throw new NotFoundException('Book with this id is not found to delete');
    }
    return await this.bookRepository.delete(id);
  }
}
