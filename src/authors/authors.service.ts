import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { Repository } from 'typeorm';
import { Author } from './entities/author.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from 'src/books/entities/book.entity';

@Injectable()
export class AuthorsService {
  constructor(
    @InjectRepository(Author)
    private readonly authorRepository: Repository<Author>,
  ) {}
  async create(createAuthorDto: CreateAuthorDto) {
    const existingAuthor = await this.authorRepository.findOne({
      where: { name: createAuthorDto.name },
    });
    if (existingAuthor) {
      throw new ConflictException('This author already exist in the system');
    }
    const author = this.authorRepository.create({
      name: createAuthorDto.name,
      bio: createAuthorDto.bio,
      books: createAuthorDto.books?.map((bookDto) => ({
        ...bookDto,
      })),
    });
    return this.authorRepository.save(author);
  }

  async findAll() {
    return await this.authorRepository.find({ relations: { books: true } });
  }

  async findOne(id: number) {
    const author = await this.authorRepository.findOne({
      where: { id },
      relations: { books: true },
    });
    if (!author) {
      throw new NotFoundException('Author with this id is not found');
    }
    return author;
  }

  async update(id: number, updateAuthorDto: UpdateAuthorDto) {
    const author = await this.authorRepository.findOne({
      where: { id },
      relations: { books: true },
    });
    if (!author) {
      throw new NotFoundException('Author with this id not found to update');
    }
    author.name = updateAuthorDto.name ?? author.name;
    author.bio = updateAuthorDto.bio ?? author.bio;

    if (updateAuthorDto.books) {
      const updatedBooks: Book[] = [];

      for (const bookDto of updateAuthorDto.books) {
        let book: Book | null;

        if (bookDto.id) {
          book = await this.authorRepository.manager.findOne(Book, {
            where: { id: bookDto.id },
          });

          if (book) {
            book.title = bookDto.title ?? book.title;
            book.description = bookDto.description ?? book.description;
            book.publishAt = bookDto.publishAt ?? book.publishAt;
            updatedBooks.push(book);
          } else {
            throw new NotFoundException(
              `Book with id ${bookDto.id} not found to update`,
            );
          }
        }
      }

      author.books = updatedBooks;
    }

    return await this.authorRepository.save(author);
  }

  async remove(id: number) {
    const author = await this.authorRepository.findOne({ where: { id } });
    if (!author) {
      throw new NotFoundException('Author with this id not found to delete');
    }
    return await this.authorRepository.delete(id);
  }
}
