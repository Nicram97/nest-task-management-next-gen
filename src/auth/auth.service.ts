import {
  Inject,
  Injectable,
  Logger,
  LoggerService,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthSignUpCredentialsDto } from './dto/auth-signup-credentials.dto';
import { UsersRepository } from './users.repository';
import * as brcypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
import { AuthSignInCredentialsDto } from './dto/auth-signin-credentials.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(Logger) private readonly logger: LoggerService,
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(
    authCredentialsDto: AuthSignUpCredentialsDto,
  ): Promise<{ accessToken: string }> {
    await this.usersRepository.createUser(authCredentialsDto);
    const payload: JwtPayload = { username: authCredentialsDto.username };
    const accessToken: string = this.jwtService.sign(payload);
    return { accessToken };
  }

  async signIn(
    authCredentialsSignInDto: AuthSignInCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const { username, password } = authCredentialsSignInDto;
    const user = await this.usersRepository.findOne({ username });

    if (user && (await brcypt.compare(password, user.password))) {
      const payload: JwtPayload = { username };
      const accessToken: string = this.jwtService.sign(payload);
      return { accessToken };
    }
    throw new UnauthorizedException('Please check Your login credentials.');
  }
}
