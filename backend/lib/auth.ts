import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';
import { UserRole } from '../types';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-development';

export interface JWTPayload {
    userId: string;
    email: string;
    role: UserRole;
}

export async function hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
}

export function generateToken(payload: JWTPayload): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): JWTPayload | null {
    try {
        return jwt.verify(token, JWT_SECRET) as JWTPayload;
    } catch (error) {
        return null;
    }
}

export function extractTokenFromRequest(request: Request): string | null {
    const authHeader = request.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
        return authHeader.substring(7);
    }
    return null;
}

export async function getUserFromRequest(request: Request): Promise<JWTPayload | null> {
    const token = extractTokenFromRequest(request);
    if (!token) return null;
    return verifyToken(token);
}

export function isValidObjectId(id: string): boolean {
    return Types.ObjectId.isValid(id);
}
