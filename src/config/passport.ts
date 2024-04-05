import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import dotenv from "dotenv";
import { Payload } from "../misc/types";
import userService from "../services/user";
import User from "../models/User";
import { loginUserForGoogelUser, registerUserForGoogelUser } from "../controllers/users";
import bcrypt from "bcrypt";

dotenv.config({ path: ".env" });

const JWT_SECRET = process.env.JWT_SECRET as string;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
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

export const googleAuthStrategy = new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID as string ,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: "http://localhost:8080/api/v1/users/auth/google/callback",
    },
    async (accessToken:any, refreshToken : any, profile:any, cb : any) => {
      const email = profile.emails[0].value;
      try {
        const user = await User.findOne({ email: email });
        console.log(user)
        if(user!=null){
            const response=await loginUserForGoogelUser({
                password: user.password,
                email,
            })
          return cb(null, response);
        }else{
          //create a new user

            const username = profile.displayName;
            const firstName=profile.name.givenName;
            const lastName=profile.name.familyName;
            const saltRounds = 10;
            const salt = await bcrypt.genSalt(saltRounds);
            const hashedPassword = await bcrypt.hash(Math.random().toString(36).slice(-8), salt);

            const response=await registerUserForGoogelUser({
                username,
                password: hashedPassword,
                firstName,
                lastName,
                email,
            })
            return  cb(null, response);

        }

      } catch (err) {
        return cb(err, null);
      }
    }
);