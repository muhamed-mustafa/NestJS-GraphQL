import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthorModule } from './author/author.module';
import { BookModule } from './book/book.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { get, set } from 'lodash';
import { decode } from './utils/jwt';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/nestjs-graphql'),

    GraphQLModule.forRoot<ApolloDriverConfig>({
      autoSchemaFile: 'schema.gql',
      driver: ApolloDriver,
      context: ({ req, res }) => {
        const token = get(req, 'cookies.token');

        const user = token ? decode(token) : null;

        if (user) {
          set(req, 'user', user);
        }

        return { req, res };
      },
    }),

    AuthorModule,
    BookModule,
    UsersModule,
  ],

  controllers: [AppController],

  providers: [AppService],
})
export class AppModule {}
