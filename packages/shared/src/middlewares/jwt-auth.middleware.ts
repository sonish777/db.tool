import { NextFunction, Request, Response } from 'express';
import passport from 'passport';
import { UnauthorizedException } from '../exceptions';

export const jwtAuth = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('jwt', { session: false }, (err: any, user: any) => {
        if (err || !user) {
            return next(new UnauthorizedException());
        }
        const conn = req.connectionStore.get(user._id);
        if (!conn) {
            return next(new UnauthorizedException());
        }
        req.user = user;
        req.conn = conn;
        return next();
    })(req, res, next);
};
