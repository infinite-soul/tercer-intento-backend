import userService from '../services/userService.js';
import passport from 'passport';
import logger from '../utils/logger.js'

class AuthController {
  async register(req, res, next) {
    passport.authenticate('local-register', (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(400).json({ message: info.message });
      }
      req.login(user, (err) => {
        if (err) {
          return next(err);
        }
        return res.redirect('/login');
      });
    })(req, res, next);
  }

  async login(req, res, next) {
    console.log('Intento de inicio de sesión', req.body);
    passport.authenticate('local', (err, user, info) => {
      console.log('Resultado de autenticación:', { err, user, info });
      if (err) {
        logger.error('Error en autenticación:', err);
        return next(err);
      }
      if (!user) {
        logger.warn('Usuario no autenticado:', info.message);
        return res.status(400).json({ message: info.message });
      }
      logger.info('Usuario autenticado exitosamente');
      req.login(user, (err) => {
        if (err) {
          logger.error('Error al iniciar sesión:', err);
          return next(err);
        }
        logger.info('Sesión iniciada, redirigiendo');
        return res.status(200).json({ message: 'Inicio de sesión exitoso' });
      });
    })(req, res, next);
  }

  logout(req, res) {
    req.session.destroy();
    res.status(200).json({ message: 'Sesión cerrada correctamente' });
  }

  async getProfile(req, res) {
    const user = req.user || req.session.user;
    if (user) {
      res.json({
        name: user.name,
        email: user.email,
        githubId: user.githubId,
        role: user.role
      });
    } else {
      res.status(401).json({ error: 'No autenticado' });
    }
  }

  async completeRegistration(req, res) {
    const { name, email } = req.body;
    try {
      const updatedUser = await userService.updateUserProfile(req.user.id, { name, email });
      res.redirect('/productos');
    } catch (err) {
      console.error('Error al completar el registro:', err);
      res.status(500).json({ error: 'Error en el servidor' });
    }
  }
}

export default new AuthController();