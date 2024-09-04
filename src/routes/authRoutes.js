import express from 'express';
import passport from 'passport';
import authController from '../controllers/authController.js';
import { isAuthenticated, isAdmin, isPremium } from '../middlewares/auth.middleware.js';
import { sendPasswordResetEmail, resetPassword } from '../utils/passwordRecovery.js';
import { forgotPassword, resetPasswordGet, resetPasswordPost } from '../controllers/authController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Autenticación y manejo de usuarios
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registra un nuevo usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *       400:
 *         description: Error en el registro
 */
router.post('/register', authController.register);

/**
 * @swagger
 * /api/auth/complete-registration:
 *   post:
 *     summary: Completa el registro de un usuario
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Registro completado exitosamente
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error en el servidor
 */
router.post('/complete-registration', isAuthenticated, authController.completeRegistration);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Inicia sesión de usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *       400:
 *         description: Error en el inicio de sesión
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Cierra la sesión del usuario
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Sesión cerrada exitosamente
 */
router.post('/logout', authController.logout);

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary: Obtiene el perfil del usuario autenticado
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil obtenido exitosamente
 *       401:
 *         description: No autorizado
 */
router.get('/profile', isAuthenticated, authController.getProfile);

/**
 * @swagger
 * /api/auth/github:
 *   get:
 *     summary: Inicia el proceso de autenticación con GitHub
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirección a GitHub para autenticación
 */
router.get('/auth/github', passport.authenticate('github'));

/**
 * @swagger
 * /api/auth/users/profile-github:
 *   get:
 *     summary: Callback para la autenticación de GitHub
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirección después de la autenticación de GitHub
 */
router.get('/users/profile-github', passport.authenticate('github', { failureRedirect: '/login' }),
  (req, res) => {
    if (!req.user.name || !req.user.email) {
      return res.redirect('/complete-registration');
    }
    res.redirect('/api/productos');
  }
);

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Solicita un restablecimiento de contraseña
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Correo de restablecimiento enviado
 *       400:
 *         description: Error en la solicitud
 */
router.post('/forgot-password', forgotPassword);

/**
 * @swagger
 * /api/auth/reset-password/{token}:
 *   get:
 *     summary: Página para restablecer la contraseña
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Página de restablecimiento de contraseña
 */
router.get('/reset-password/:token', resetPasswordGet);

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Restablece la contraseña
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - newPassword
 *             properties:
 *               token:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Contraseña restablecida exitosamente
 *       400:
 *         description: Error en el restablecimiento de contraseña
 */
router.post('/reset-password', resetPasswordPost);

export default router;