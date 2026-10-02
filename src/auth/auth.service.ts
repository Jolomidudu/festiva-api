import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";

import { PrismaService } from "../prisma/prisma.service";

import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { ChangePasswordDto } from "./dto/change-password.dto";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const email = dto.email.toLowerCase().trim();

    if (await this.prisma.user.findUnique({ where: { email } })) {
      throw new ConflictException("Email already exists.");
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);

    const user = await this.prisma.user.create({
      data: {
        name: dto.name.trim(),
        email,
        passwordHash,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    return this.issueToken(user);
  }

  async login(dto: LoginDto) {
    const email = dto.email.toLowerCase().trim();

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (
      !user ||
      !(await bcrypt.compare(dto.password, user.passwordHash))
    ) {
      throw new UnauthorizedException("Invalid email or password.");
    }

    return this.issueToken({
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    });
  }

  async updateProfile(
    userId: string,
    dto: UpdateProfileDto,
  ) {
    const email = dto.email.toLowerCase().trim();
    const name = dto.name.trim();

    const existingUser = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    if (!existingUser) {
      throw new UnauthorizedException("User not found.");
    }

    const emailOwner = await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
      },
    });

    if (emailOwner && emailOwner.id !== userId) {
      throw new ConflictException(
        "That email address is already in use.",
      );
    }

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        name,
        email,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    return {
      message: "Profile updated successfully.",
      user,
    };
  }

  async changePassword(
    userId: string,
    dto: ChangePasswordDto,
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        passwordHash: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException("User not found.");
    }

    const currentPasswordValid = await bcrypt.compare(
      dto.currentPassword,
      user.passwordHash,
    );

    if (!currentPasswordValid) {
      throw new UnauthorizedException(
        "Current password is incorrect.",
      );
    }

    if (dto.currentPassword === dto.newPassword) {
      throw new ConflictException(
        "New password must be different from your current password.",
      );
    }

    const passwordHash = await bcrypt.hash(
      dto.newPassword,
      12,
    );

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        passwordHash,
      },
    });

    return {
      message: "Password changed successfully.",
    };
  }

  private async issueToken(user: {
    id: string;
    name: string;
    email: string;
    createdAt: Date;
  }) {
    return {
      accessToken: await this.jwt.signAsync({
        sub: user.id,
        email: user.email,
        name: user.name,
      }),
      user,
    };
  }
}