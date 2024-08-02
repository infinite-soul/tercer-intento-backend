import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GitHubStrategy } from 'passport-github';
import userService from '../../services/userService.js';
import "dotenv/config";

export default function configurePassport() {
  passport.use(
    'local-register',
    new LocalStrategy(
      { usernameField: 'email', passReqToCallback: true },
      async (req, email, password, done) => {
        try {
          const existingUser = await userService.findByEmail(email);
          if (existingUser) {
            return done(null, false, { message: 'El correo electrónico ya está registrado' });
          }
          const newUser = await userService.register({ email, password });
          return done(null, newUser);
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  passport.use(new LocalStrategy({ usernameField: 'email' },
    async (email, password, done) => {
      try {
        const user = await userService.login(email, password);
        return done(null, user);
      } catch (error) {
        return done(null, false, { message: error.message });
      }
    }
  ));

  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const user = await userService.findOrCreateGithubUser(profile);
          done(null, user);
        } catch (err) {
          done(err);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await userService.findById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
}