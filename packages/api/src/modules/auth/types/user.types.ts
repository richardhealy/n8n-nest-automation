export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
  organizationId: string;
} 