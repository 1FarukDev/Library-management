import { Request, Response, NextFunction } from 'express';
import { UnauthenticatedError } from '../errors'; 
import { AuthenticatedRequest } from '../@types/express'; 

const adminOnly = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || req.user.role !== 'admin') {
        throw new UnauthenticatedError('Access denied. Admins only.');
    }
    next();
};

export default adminOnly;
