import { Injectable } from '@nestjs/common';
import { Book, CreateBookInput } from './book.schema';
import books from 'src/data/books';

@Injectable()
export class BookService {
  books: Partial<Book>[];

  constructor() {
    this.books = books;
  }

  async findMany() {
    return this.books;
  }

  async findById(id: number) {
    const books = this.books.filter((book) => book.id === id);
    return books.length ? books[0] : null;
  }

  async findByAuthorId(authorId: number) {
    return this.books.filter((book) => book.author === authorId);
  }

  async createBook(book: CreateBookInput) {
    this.books = [book, ...this.books];
    return book;
  }
}
