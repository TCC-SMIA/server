import User from '../infra/typeorm/entities/User';
import IUsersRepository from '../rules/IUsersRepository';

class CreateUserService {
  private usersRepository: IUsersRepository;

  constructor(usersRepository: IUsersRepository) {
    this.usersRepository = usersRepository;
  }

  async execute(): Promise<User> {
    const user = this.usersRepository.create();

    return user;
  }
}

export default CreateUserService;
