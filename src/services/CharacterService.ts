import { Character } from '@/entities/Character';
import { CharacterRepository } from '@/repositories/CharacterRepository';
import { ErrorResponse } from '@/helpers/ErrorResponse';

export class CharacterService {
  private repository = new CharacterRepository();

  async getById(id: number): Promise<Character> {
    const character = await this.repository.findById(id);
    if (!character) {
      throw new ErrorResponse('character.not.found');
    }
    return character;
  }

  async getAll(): Promise<Character[]> {
    return await this.repository.findAll();
  }
}
