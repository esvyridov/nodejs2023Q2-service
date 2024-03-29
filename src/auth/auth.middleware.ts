import { HttpStatus, Injectable, NestMiddleware } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { NextFunction, Request, Response } from "express";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(private readonly jwtService: JwtService) {}

    async use(req: Request, res: Response, next: NextFunction) {
        const authorization = req.headers['authorization'];

        if (typeof authorization !== 'string' || !authorization?.startsWith('Bearer ')) {
            return res.status(HttpStatus.UNAUTHORIZED).json({
                error: 'Authorization header is invalid',
            })
        }

        const token = authorization.substring('Bearer '.length);

        try {
            await this.jwtService.verifyAsync(token);
            next();
        } catch (err) {
            if (!authorization.startsWith('Bearer ')) {
                return res.status(HttpStatus.UNAUTHORIZED).json({
                    error: 'Authorization header is invalid',
                })
            }
        }
        
    }
}