import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose/dist';
import { Model } from 'mongoose';
import { Book, CreateBookInput, BookDocument } from './book.schema';

@Injectable()
export class BookService {
  constructor(
    @InjectModel(Book.name) private bookService: Model<BookDocument>,
  ) {}

  async findMany() {
    return this.bookService.find().lean();
  }

  async findById(id: number) {
    return this.bookService.findById(id).lean();
  }

  async findByAuthorId(authorId) {
    return this.bookService.find({ author: authorId });
  }

  async createBook(book: CreateBookInput) {
    return this.bookService.create(book);
  }
}
