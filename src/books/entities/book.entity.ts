import { Author } from 'src/authors/entities/author.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;
  @Column({ nullable: true })
  description: string;
  @Column({ type: Date, nullable: true })
  publishAt: Date;

  @ManyToOne(() => Author, (author) => author.books, { cascade: true })
  @JoinColumn()
  author: Author;
}
