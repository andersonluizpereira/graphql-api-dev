import { DbConnection } from "./DbConnectionInterface";
import { AuthUser } from "./AuthUserInterface";

export interface ResolverContext {
    authUser: string;
    db?: DbConnection;
    authorization?: string;
    user?: AuthUser;
}