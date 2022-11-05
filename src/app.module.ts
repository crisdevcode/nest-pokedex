import { join } from 'path'; // Node package
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MongooseModule } from '@nestjs/mongoose';

import { PokemonModule } from './pokemon/pokemon.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    // Static files website
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public')
    }),

    // Database connection
    MongooseModule.forRoot('mongodb://localhost:27017/nest-pokemon'),

    // Modules
    PokemonModule,

    CommonModule
  ]
})
export class AppModule {}
