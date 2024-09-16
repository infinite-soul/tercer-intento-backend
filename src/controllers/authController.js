import userService from '../services/userService.js';
import passport from 'passport';
import logger from '../utils/logger.js'
import { sendPasswordResetEmail, resetPassword } from '../utils/passwordRecovery.js';

class AuthController {
  async register(req, res, next) {
    logger.info('Register function triggered with data:', req.body);

    passport.authenticate('local-register', (err, user, info) => {
      if (err) {
        logger.error('Error during authentication:', err);
        return res.status(500).json({ message: 'Error interno del servidor' });
      }
      if (!user) {
        logger.warning('Authentication failed, no user found:', info.message);
        return res.status(400).json({ message: info.message });
      }

      req.login(user, (err) => {
        if (err) {
          logger.error('Error during login:', err);
          return res.status(500).json({ message: 'Error al iniciar sesión' });
        }
        logger.info('User successfully registered and logged in:', user);
        return res.status(201).json({ message: 'Registro exitoso', userId: user._id });
      });
    })(req, res, next);
  }

  async completeRegistration(req, res) {
    const { name, email } = req.body;
    if (!req.user) {
      logger.error('No user found in request');
      return res.status(401).json({ error: 'No autenticado' });
    }
    try {
      const updatedUser = await userService.updateUserProfile(req.user.id, { name, email });
      logger.info('User registration completed:', updatedUser);
      res.status(200).json({ message: 'Registro completado con éxito' });
    } catch (err) {
      logger.error('Error al completar el registro:', err);
      res.status(500).json({ error: 'Error en el servidor al completar el registro' });
    }
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
        logger.warning('Usuario no autenticado:', info.message);
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
      res.status(200).json({
        name: user.name,
        email: user.email,
        role: user.role
      });
    } else {
      res.status(401).json({ error: 'No autenticado' });
    }
  }

}

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const previewURL = await sendPasswordResetEmail(email);
    res.json({
      message: 'Se ha enviado un correo con instrucciones para restablecer la contraseña.',
      previewURL
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const resetPasswordGet = async (req, res) => {
  const { token } = req.params;
  res.render('reset-password', { token });
};

export const resetPasswordPost = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    console.log('Datos recibidos en resetPasswordPost:', { token, newPassword: newPassword ? '[REDACTED]' : undefined });
    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Token y nueva contraseña son requeridos' });
    }
    await resetPassword(token, newPassword);
    res.json({ message: 'Contraseña restablecida con éxito' });
  } catch (error) {
    console.error('Error en resetPasswordPost:', error);
    res.status(400).json({ error: error.message });
  }
};

export default new AuthController();