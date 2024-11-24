import { Request } from 'express';

declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: string;
                name: string;
                role: "user" | "admin";
                googleId?: string
            };
        }
    }
}



export interface AuthenticatedRequest extends Request {
    user?: {
        userId: string;
        name: string
        role: "user" | "admin";
    }
}



export interface GoogleUser {
    googleId: string;
    name: string;
    email?: string;
}

declare global {
    namespace Express {
        interface User extends GoogleUser { }
    }
}
