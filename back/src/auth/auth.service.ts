import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from '../user/dto/register.dto';
import { AppUserService } from 'src/app-user/app-user.service';
import { LoginDto } from 'src/user/dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private appuserService: AppUserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(loginDto: LoginDto): Promise<any> {
    const { email, password } = loginDto;
    const user = await this.appuserService.findByEmail(email);
  
    if (!user) return null;
  
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return null;
  
    const { password: _, ...result } = user;
    return result;
  }
  
  
     
  

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto);
    
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }
  
    const payload = { email: user.email, sub: user.id };
    return {
      user,
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(registerDto: RegisterDto) {
    const userExists = await this.appuserService.findByEmail(registerDto.email);
    if (userExists) {
      throw new UnauthorizedException('User already exists');
    }
    if (registerDto.email === process.env.ADMIN_EMAIL) {
      throw new BadRequestException('This email is reserved.');
    }
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const newUser = await this.appuserService.create({
      ...registerDto,
      password: hashedPassword,
    });

    const { password, ...result } = newUser;
    
    return result;
  }
}