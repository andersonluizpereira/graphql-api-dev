import { RequestHandler, Request, Response, NextFunction } from "express";
import * as jwt from 'jsonwebtoken'
import { JWT_SECRET } from "../utils/utils";
import db from './../model'
import { UserInstance } from "../model/UserModel";


export const extractJwtMiddleware = (): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction): void => {
        let authorization: string = req.get('autorization');
        let token: string  = authorization ? authorization.split(' ')[1] : undefined;

        req['context'] = {};
        req['context']['authorization'] = authorization;

        if(!token) { return next(); }

        jwt.verify(token, JWT_SECRET, (err, decode: any) =>{
            if(err) { return next(); }
            db.User.findById(decode.sub, {
                attributes: ['id','email']
            }).then((user: UserInstance) => {
                if(user) {
                    req['context']['user'] = {
                        id: user.get('id'),
                        email: user.get('email')
                    }
                }
                return next();
            });
        });
    };
};
