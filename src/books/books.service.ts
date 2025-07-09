import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Repository } from 'typeorm';
import { Book } from './entities/book.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Author } from 'src/authors/entities/author.entity';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book) private readonly bookRepository: Repository<Book>,
    @InjectRepository(Author)
    private readonly authorRepository: Repository<Author>,
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
    const author = await this.preloadAuthor(createBookDto);
    const book = this.bookRepository.create({ ...createBookDto, author });
    return await this.bookRepository.save(book);
  }

  async findAll() {
    return await this.bookRepository.find({ relations: { author: true } });
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
  private async preloadAuthor(createBookDto: CreateBookDto) {
    if (createBookDto.author.name) {
      const existingauthor = await this.authorRepository.findOne({
        where: { name: createBookDto.author.name },
      });
      if (existingauthor) {
        return existingauthor;
      }
      const author = this.authorRepository.create(createBookDto.author);
      return await this.authorRepository.save(author);
    } else {
      throw new BadRequestException('Author information is required');
    }
  }
}
