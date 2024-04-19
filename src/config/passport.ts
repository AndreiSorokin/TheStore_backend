

import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import GoogleTokenStrategy from "passport-google-id-token";
import dotenv from "dotenv";
import { Payload } from "../misc/types";
import userService from "../services/user";
import User from "../models/User";
import { loginUserForGoogelUser, registerUserForGoogelUser } from "../controllers/users";
import bcrypt from "bcrypt";

dotenv.config({ path: ".env" });

const JWT_SECRET = process.env.JWT_SECRET as string;
// good
export const jwtStrategy = new JwtStrategy(
  {
    secretOrKey: JWT_SECRET,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  },
  async (payload: Payload, done: any) => {
    const userEmail = payload.email;
    try {
      const user = await userService.getUserByEmail(userEmail);
      done(null, user);
    } catch (error) {
      done(error, false);
    }
  }
);

// add logic 
export const googleAuthStrategy = new GoogleTokenStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID as string ,
    },
    async (parsedToken: any, googleId: string, done: any) => {
      //parsedToken: data from Google after it dont auth
      // send id_token
      const userPayload = {
      email: parsedToken.payload.email,
      // hashed password
  
    };
        
   const user  = await userService.findOrCreate(userPayload)
  done(null, user);}
);