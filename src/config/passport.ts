import passport from 'passport';
import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20';
import dotenv from 'dotenv';

dotenv.config();

interface User {
    id: string;
    googleId: string;
    name: string;
    email?: string;
}

const users: User[] = [];

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
            callbackURL: process.env.CALLBACK_URL || '',
        },


        (accessToken: string, refreshToken: string, profile: Profile, done: (error: any, user?: User | false) => void) => {
            try {

                let user = users.find((u) => u.googleId === profile.id);
                if (!user) {
                    user = {
                        id: `${users.length + 1}`,
                        googleId: profile.id,
                        name: profile.displayName,
                        email: profile.emails?.[0]?.value,
                    };
                    users.push(user);
                }
                return done(null, user);
            } catch (error) {
                return done(error, false);
            }
        }
    )
);
// console.log(process.env.GOOGLE_CLIENT_ID,
//     process.env.GOOGLE_CLIENT_SECRET,
//     process.env.CALLBACK_URL)
passport.serializeUser((user: Express.User, done) => {
    done(null, (user as User).id);
});

passport.deserializeUser((id: string, done) => {
    const user = users.find((u) => u.id === id);
    if (user) {
        done(null, user);
    } else {
        done(new Error('User not found'), null);
    }
});

export default passport;
