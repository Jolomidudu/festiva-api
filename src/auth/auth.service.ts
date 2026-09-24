import { ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { PrismaService } from "../prisma/prisma.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  async register(dto: RegisterDto) {
    const email = dto.email.toLowerCase().trim();

    if (await this.prisma.user.findUnique({ where: { email } })) {
      throw new ConflictException("Email already exists.");
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);

    const user = await this.prisma.user.create({
      data: { name: dto.name.trim(), email, passwordHash },
      select: { id: true, name: true, email: true, createdAt: true }
    });

    return this.issueToken(user);
  }

  async login(dto: LoginDto) {
    const email = dto.email.toLowerCase().trim();
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(dto.password, user.passwordHash))) {
      throw new UnauthorizedException("Invalid email or password.");
    }

    return this.issueToken({
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt
    });
  }

  private async issueToken(user: { id: string; name: string; email: string; createdAt: Date }) {
    return {
      accessToken: await this.jwt.signAsync({
        sub: user.id,
        email: user.email,
        name: user.name
      }),
      user
    };
  }
}