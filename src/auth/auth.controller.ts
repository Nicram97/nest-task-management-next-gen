import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthSignInCredentialsDto } from './dto/auth-signin-credentials.dto';
import { AuthSignUpCredentialsDto } from './dto/auth-signup-credentials.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(
    @Body() authCredentialsSignUpDto: AuthSignUpCredentialsDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.signUp(authCredentialsSignUpDto);
  }

  @Post('/signin')
  signIn(
    @Body() authCredentialsSignInDto: AuthSignInCredentialsDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(authCredentialsSignInDto);
  }
}
