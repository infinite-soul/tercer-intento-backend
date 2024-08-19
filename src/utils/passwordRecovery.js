import nodemailer from 'nodemailer';
import crypto from 'crypto';
import { UserModel } from '../dao/MongoDB/User.model.js';
import dotenv from 'dotenv';

import bcrypt from 'bcrypt';

dotenv.config();

async function createTransporter() {
    const testAccount = await nodemailer.createTestAccount();
    return nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass
        }
    });
}

export const sendPasswordResetEmail = async (email) => {
    const user = await UserModel.findOne({ email });
    if (!user) throw new Error('Usuario no encontrado');
  
    const token = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hora
    await user.save();
  
    console.log('Token generado y guardado:', token);
    console.log('Expira en:', user.resetPasswordExpires);

    const resetURL = `${process.env.APP_DOMAIN}/reset-password/${token}`;

    const transporter = await createTransporter();
    const mailOptions = {
        from: '"Servicio de Restablecimiento" <noreply@example.com>',
        to: user.email,
        subject: 'Restablecimiento de contraseña',
        html: `
      <h1>Restablecimiento de Contraseña</h1>
      <p>Has solicitado restablecer tu contraseña.</p>
      <p>Por favor, haz clic en el siguiente enlace para restablecer tu contraseña:</p>
      <a href="${resetURL}">Restablecer contraseña</a>
      <p>Este enlace expirará en 1 hora.</p>
      <p>Si no solicitaste esto, por favor ignora este correo.</p>
    `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('URL de vista previa: %s', nodemailer.getTestMessageUrl(info));
    return nodemailer.getTestMessageUrl(info);
};

export const resetPassword = async (token, newPassword) => {
    console.log('Iniciando resetPassword con token:', token);
    
    const user = await UserModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });
  
    console.log('Usuario encontrado:', user ? 'Sí' : 'No');
    if (user) {
      console.log('Token expira en:', user.resetPasswordExpires);
      console.log('Tiempo actual:', new Date());
    }
  
    if (!user) {
      throw new Error('Token inválido o expirado');
    }
  
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      throw new Error('La nueva contraseña debe ser diferente a la actual');
    }
  
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
  
    return user;
  };