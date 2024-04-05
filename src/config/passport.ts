import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import GoogleTokenStrategy from "passport-google-id-token";
import dotenv from "dotenv";

import { Payload } from "../misc/types";
import userService from "../services/user";

dotenv.config({ path: ".env" });

const JWT_SECRET = process.env.JWT_SECRET as string;

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

const clientId = "string";
export const googleStrategy = new GoogleTokenStrategy(
  { clientID: clientId },
  async () => {}
);
