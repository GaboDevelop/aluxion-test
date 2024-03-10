import * as dotenv from 'dotenv';

dotenv.config();



export const jwtConstants = {
    // generate secrete
    secret: process.env.SECRET_OAUTH,
};