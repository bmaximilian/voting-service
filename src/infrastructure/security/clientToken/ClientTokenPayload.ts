export interface ClientTokenPayload {
    sub: string; // Client id
    exp: number; // Token expiry
    sess: string; // session id
    ptc: string; // participant id
}
