import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { AuthSignUpCredentialsDto } from './dto/auth-signup-credentials.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  async createUser(
    authCredentialsDto: AuthSignUpCredentialsDto,
  ): Promise<void> {
    try {
      const { username, password } = authCredentialsDto;
      const salt: string = await bcrypt.genSalt();
      const hashedPassword: string = await bcrypt.hash(password, salt);

      const user = this.create({ username, password: hashedPassword });
      await this.save(user);
    } catch (e) {
      // duplicate username
      if (e.code === '23505') {
        throw new ConflictException('Username already taken');
      }
      throw new InternalServerErrorException();
    }
  }
}
