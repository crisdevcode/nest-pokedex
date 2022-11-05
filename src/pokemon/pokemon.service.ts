import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';

import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';

@Injectable()
export class PokemonService {

  // Inject Entity dependency
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon> // Table name
  ) {}

  async create(createPokemonDto: CreatePokemonDto) {
    // Convert name to lowerCase
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();

    try {
      // Save to database
      const pokemon = await this.pokemonModel.create(createPokemonDto);
  
      // Send Response
      return  pokemon;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  findAll() {
    return `This action returns all pokemon`;
  }

  async findOne(term: string) {

    let pokemon: Pokemon;

    // Search by "no"
    // If the data is correct, then search a Pokemon
    if(!isNaN(+term)){
      pokemon = await this.pokemonModel.findOne({ no: term })
    }

    // Search by "MongoID"
    // If I don't have a pokemon and the MongoID is correct, then search a Pokemon
    if(!pokemon && isValidObjectId(term)) {
      pokemon = await this.pokemonModel.findById(term);
    }

    // Search by "Name"
    // If I don't have a pokemon, then search a Pokemon by Name
    if(!pokemon) {
      pokemon = await this.pokemonModel.findOne({ name: term.toLowerCase().trim() })
    }

    // If it doesn't exist, then throw error.
    if(!pokemon)
      // Handled exceptions
      throw new NotFoundException(`Pokemon with id, name or no "${term}" not found`);

    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    // Search pokemon
    const pokemon = await this.findOne(term);

    // Modify data
    if(updatePokemonDto.name)
    updatePokemonDto.name = updatePokemonDto.name.toLowerCase();
    
    try {
      // Update data in database
      await pokemon.updateOne(updatePokemonDto);
  
      // Send response
      return { ...pokemon.toJSON(), ...updatePokemonDto };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    // Delete based on MongoID
    const { deletedCount } = await this.pokemonModel.deleteOne({ _id: id });
    if(deletedCount === 0) 
      throw new BadRequestException(`Pokemon with id "${id}" not found`);

    return;
  }

  // Unhandled Exceptions
  private handleExceptions(error: any) {
    if(error.code === 11000) {
      throw new BadRequestException(`Pokemon exists in database ${ JSON.stringify(error.keyValue) }`);
    }
    console.log(error);
    throw new InternalServerErrorException(`Can't create Pokemon - Check server logs`);
  }
}