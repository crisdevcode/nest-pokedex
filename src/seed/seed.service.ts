import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PokeResponse } from './interfaces/poke-response.interface';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>, // Table name
    private readonly http: AxiosAdapter,
  ) {}

  async executeSeed() {

    // Remove all registers
    await this.pokemonModel.deleteMany({}); // delete * from pokemons;

    const data = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=650');
    
    // Array of pokemons to insert
    const pokemonToInsert: { name: string, no: number }[] = [];

    data.results.forEach(({ name, url }) => {
      const segments = url.split('/');
      const no = +segments[segments.length - 2];

      // Store each pokemon inside the array
      pokemonToInsert.push({ name, no });
    })

    // Insert array with Each pokemon (one insertion) 
    await this.pokemonModel.insertMany(pokemonToInsert);

    return 'Seed Executed';
  }
}

// First
// async executeSeed() {

//   // Remove all registers
//   await this.pokemonModel.deleteMany({}); // delete * from pokemons;

//   const { data } = await this.axios.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=10');
  
//   const insertPromisesArray = [];

//   data.results.forEach(({ name, url }) => {
//     const segments = url.split('/');
//     const no = +segments[segments.length - 2];

//     // Store the promises inside the array
//     insertPromisesArray.push(this.pokemonModel.create({ name, no }))
//   })

//   // Solve all the Promises (Each register)
//   await Promise.all(insertPromisesArray);

//   return 'Seed Executed';
// }
