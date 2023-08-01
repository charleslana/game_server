import AppDataSource from '@/orm';
import { CreateUserDto } from '@/dto/CreateUserDto';
import { Repository } from 'typeorm';
import { User } from '@/entities/User';

export class UserRepository {
  private userRepository: Repository<User>;

  constructor() {
    this.userRepository = AppDataSource.manager.getRepository(User);
  }

  async save(dto: CreateUserDto): Promise<User> {
    const newUser = this.userRepository.create(dto);
    return await this.userRepository.save(newUser);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findByEmail(email: string): Promise<User | null> {
    const lowerCaseEmail = email.toLowerCase();
    return await this.userRepository.findOne({
      where: { email: lowerCaseEmail },
      relations: ['roles'],
    });
  }

  async findById(id: number): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { id: id },
      relations: ['roles'],
    });
  }
}
