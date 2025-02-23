import {
	Injectable,
	UnauthorizedException,
	ConflictException,
	InternalServerErrorException,
} from '@nestjs/common';
import type { JwtService } from '@nestjs/jwt';
import type { PrismaService } from '../prisma/prisma.service';
import type { ConfigService } from '@nestjs/config';
import type { RegisterDto } from './dto/register.dto';
import type { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import type { User } from '@prisma/client';

@Injectable()
export class AuthService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly jwtService: JwtService,
		private readonly config: ConfigService,
	) {}

	async register(registerDto: RegisterDto) {
		const { email, password, organizationId } = registerDto;

		// Check if user exists
		const existingUser = await this.prisma.user.findUnique({
			where: { email },
		});

		if (existingUser) {
			throw new ConflictException('User already exists');
		}

		// Check if organization exists
		const organization = await this.prisma.organization.findUnique({
			where: { id: organizationId },
		});

		if (!organization) {
			throw new UnauthorizedException('Invalid organization');
		}

		try {
			// Hash password
			const hashedPassword = await bcrypt.hash(password, 10);

			// Create user with default role USER
			const user = await this.prisma.user.create({
				data: {
					email,
					password: hashedPassword,
					role: 'USER', // Set default role
					organization: {
						connect: { id: organizationId },
					},
				},
				include: { organization: true }, // Include organization data
			});

			// Generate token with role
			const token = this.jwtService.sign({
				userId: user.id,
				role: user.role,
				email: user.email,
			});

			return {
				user: this.excludePassword(user),
				token,
			};
		} catch (error) {
			throw new InternalServerErrorException('Error creating user');
		}
	}

	async login(loginDto: LoginDto) {
		const { email, password } = loginDto;

		// Find user
		const user = await this.prisma.user.findUnique({
			where: { email },
		});

		if (!user) {
			throw new UnauthorizedException('Invalid credentials');
		}

		// Verify password
		const isPasswordValid = await bcrypt.compare(password, user.password);

		if (!isPasswordValid) {
			throw new UnauthorizedException('Invalid credentials');
		}

		// Generate token with userId
		const token = this.jwtService.sign({
			userId: user.id,
			// Add these fields to ensure they're in the JWT
			role: user.role,
			email: user.email,
		});

		return {
			user: this.excludePassword(user),
			token,
		};
	}

	async validateUser(userId: string): Promise<User> {
		const user = await this.prisma.user.findUnique({
			where: { id: userId },
		});

		if (!user) {
			throw new UnauthorizedException('User not found');
		}

		return user;
	}

	private excludePassword(user: User) {
		const { password, ...userWithoutPassword } = user;
		return userWithoutPassword;
	}
}
