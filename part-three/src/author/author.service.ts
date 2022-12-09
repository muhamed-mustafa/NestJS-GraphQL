import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose/dist';
import { Author, AuthorDocument } from './author.schema';
import { Model } from 'mongoose';

@Injectable()
export class AuthorService {
  constructor(
    @InjectModel(Author.name) private authorService: Model<AuthorDocument>,
  ) {}

  async findById(id) {
    return this.authorService.findById(id).lean();
  }

  async findMany() {
    return this.authorService.find().lean();
  }

  async createAuthor(input) {
    return this.authorService.create(input);
  }
}
