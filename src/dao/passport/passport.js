import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GitHubStrategy } from 'passport-github';
import { UserModel } from '../MongoDB/User.model.js';
import bcrypt from 'bcrypt';
import "dotenv/config";

// Estrategia de autenticación local
passport.use(
  'local-register',
  new LocalStrategy(
    { usernameField: 'email', passReqToCallback: true },
    async (req, email, password, done) => {
      try {
        const user = await UserModel.findOne({ email });
        if (user) {
          return done(null, false, { message: 'El correo electrónico ya está registrado' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new UserModel({ email, password: hashedPassword });
        const savedUser = await newUser.save();
        return done(null, savedUser);
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.use(
  'local',
  new LocalStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
      try {
        const user = await UserModel.findOne({ email });
        if (!user) {
          return done(null, false, { message: 'Credenciales inválidas' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          return done(null, false, { message: 'Credenciales inválidas' });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// Estrategia de autenticación con GitHub
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await UserModel.findOne({ githubId: profile.id });
        if (user) {
          return done(null, user);
        }

        // Obtener el nombre y el email del perfil de GitHub
        const name = profile.displayName || profile.username || 'Usuario de GitHub';
        const email = profile.emails && profile.emails[0] ? profile.emails[0].value : `${profile.id}@github.com`;

        user = new UserModel({
          githubId: profile.id,
          name: name,
          email: email,
        });
        await user.save();
        done(null, user);
      } catch (err) {
        done(err);
      }
    }
  )
);
// Serialización y deserialización de usuarios
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await UserModel.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});