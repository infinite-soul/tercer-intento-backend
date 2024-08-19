import express from 'express';
import passport from 'passport';
import authController from '../controllers/authController.js';
import { isAuthenticated, isAdmin, isPremium } from '../middlewares/auth.middleware.js';
import { sendPasswordResetEmail, resetPassword } from '../utils/passwordRecovery.js';
import { forgotPassword, resetPasswordGet, resetPasswordPost } from '../controllers/authController.js';



const router = express.Router();

router.post('/register', authController.register);
router.post('/complete-registration', isAuthenticated, authController.completeRegistration);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/profile', isAuthenticated, authController.getProfile);

router.get('/auth/github', passport.authenticate('github'));
router.get('/users/profile-github', passport.authenticate('github', { failureRedirect: '/login' }),
  (req, res) => {
    if (!req.user.name || !req.user.email) {
      return res.redirect('/complete-registration');
    }
    res.redirect('/api/productos');
  }
);

router.get('/complete-registration', (req, res) => {
  res.render('complete-registration', { user: req.user });
});

router.post('/forgot-password', forgotPassword);
router.get('/reset-password/:token', resetPasswordGet);
router.post('/reset-password', resetPasswordPost);

export default router;