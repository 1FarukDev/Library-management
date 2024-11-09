import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken'
import { UnauthenticatedError } from '../errors';

interface JwtPayload {
    userId: string;
    name: string;
    role: "user" | "admin";
}


interface AuthenticatedRequest extends Request {
    user?: {
        userId: string;
        name: string;
        role: "user" | "admin";
    };
}

const auth = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthenticatedError('Authentication invalid');
    }
    const token = authHeader.split(' ')[1];
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
        console.log(payload, 'name')
        req.user = { userId: payload.userId, name: payload.name, role: payload.role };

        next();
    } catch (error) {
        throw new UnauthenticatedError('Authentication invalid');
    }
};

export default auth;