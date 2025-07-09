import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
