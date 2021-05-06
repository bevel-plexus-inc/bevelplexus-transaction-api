import { GenericRole } from "@shared/types";
import { AuthenticationError } from "apollo-server-express";
import { Request } from "express";
import jwt from "jsonwebtoken";

export function isTokenExpired(token: string): boolean {
    const { JWT_SECRET } = process.env;
    if (!JWT_SECRET) {
        throw new Error("Internal Server Error: environment setup");
    }

    try {
        jwt.verify(token, JWT_SECRET);

        return false;
    } catch (e) {
        return true;
    }
}

interface ContextRequest {
    req: Request;
    user?: null | { id: string, countryId: string } | string;
    admin?: null | { id: string } | string;
}

export async function authResolver({ req }: { req: Request }): Promise<ContextRequest> {
    if (!req.headers || (!req.headers.apikey && !req.headers.authorization)) {
        return {
            req,
            user: null,
        };
    }

    if (req.headers.apikey && process.env.APP_KEY) {
        return {
            req,
            // tslint:disable-next-line:tsr-detect-possible-timing-attacks
            user: req.headers.apikey === process.env.APP_KEY ? process.env.APP_KEY : null,
        };
    }

    const tokenArray: Array<string> = req.headers.authorization!.split(" ");
    const tokenArrayLength = 2;
    // tslint:disable-next-line:tsr-detect-possible-timing-attacks
    if (tokenArray.length !== tokenArrayLength) {
        return {
            req,
            user: null,
        };
    }

    const { JWT_SECRET } = process.env;
    if (!JWT_SECRET) {
        throw new Error("Internal Server Error: environment setup");
    }
    const token = tokenArray[1];
    if (isTokenExpired(token)) {
        return {
            req,
            user: null,
        };
    }

    // tslint:disable-next-line:ban-ts-ignore
    // @ts-ignore
    const decodedToken: { id: string, countryId: string, role?: string } = jwt.verify(token, JWT_SECRET);
    if (decodedToken.role) {
        return {
            req,
            admin: { id: decodedToken.id },
        };
    }

    return {
        req,
        user: {
            id:        decodedToken.id,
            countryId: decodedToken.countryId,
        },
    };
}

export function authorizationChecker(
    { context: { user, admin } }: { context: ContextRequest},
    roles: Array<GenericRole>,
): boolean {
    if (roles.length && roles.some(role => role === GenericRole.Admin)) {
        if (admin) {
            return true;
        }
        throw new AuthenticationError("Authentication error");
    }

    if (user || admin) {
        return true;
    }
    throw new AuthenticationError("Authentication error");
}
