import { ErrorResponse } from '@/helpers/ErrorResponse';
import { Item } from '@/entities/Item';
import { ItemRepository } from '@/repositories/ItemRepository';

export class ItemService {
  private repository = new ItemRepository();

  async getById(id: number): Promise<Item> {
    const item = await this.repository.findById(id);
    if (!item) {
      throw new ErrorResponse('item.not.found');
    }
    return item;
  }

  async getAll(): Promise<Item[]> {
    return await this.repository.findAll();
  }
}
