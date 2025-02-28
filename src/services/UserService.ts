import { AppDataSource } from '../config/ormconfig';
import { User } from '../entities/User';

interface PaginationParams {
  take?: number;
  skip?: number;
}

class UserService {
  private userRepo = AppDataSource.getRepository(User);

  async createUser(name: string, lastName: string, email: string, password: string, wallet: string): Promise<User> {
    const existingUser = await this.userRepo.findOne({ where: { email } });
    if (existingUser) throw new Error('Email already exists');

    const user = this.userRepo.create({ name, lastName, email, password, wallet });
    return this.userRepo.save(user);
  }

  async getUserById(id: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { id } });
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { email } });
  }

  async getAllUsers(
    pagination?: PaginationParams
  ): Promise<{ users: User[]; total: number }> {
    const [users, total] = await this.userRepo.findAndCount({
      take: pagination?.take,
      skip: pagination?.skip,
      order: { createdAt: 'DESC' }
    });

    return { users, total };
  }
}

export default UserService;
