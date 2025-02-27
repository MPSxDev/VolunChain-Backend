import { AppDataSource } from '../config/ormconfig';
import { User } from '../entities/User';

interface PaginationOptions {
  page?: number;
  limit?: number;
}

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
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

  async getAllUsers(options: PaginationOptions = {}): Promise<PaginatedResponse<User>> {
    const page = options.page || 1;
    const limit = options.limit || 10;
    const skip = (page - 1) * limit;

    const [users, total] = await this.userRepo.findAndCount({
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      data: users,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }
}

export default UserService;
