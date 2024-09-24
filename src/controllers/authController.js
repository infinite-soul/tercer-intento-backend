import userService from '../services/userService.js';
import passport from 'passport';
import logger from '../utils/logger.js'
import { sendPasswordResetEmail, resetPassword } from '../utils/passwordRecovery.js';
import { UserModel } from '../dao/MongoDB/User.model.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

class AuthController {
  async register(req, res) {
    try {
      const { email, password, name } = req.body;
      
      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'El correo electrónico ya está registrado' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      
      const newUser = new UserModel({
        email,
        password: hashedPassword,
        name
      });

      await newUser.save();

      res.status(201).json({ message: 'Usuario registrado exitosamente' });
    } catch (error) {
      logger.error('Error in register:', error);
      res.status(500).json({ message: 'Error en el servidor' });
    }
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

  async updateUserToPremium(req, res) {
    try {
      const { uid } = req.params;
      const user = await UserModel.findById(uid);
  
      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
  
      if (user.role === 'premium') {
        user.role = 'usuario';
      } else if (user.role === 'usuario') {
        const requiredDocs = ['identificacion', 'comprobante_domicilio', 'comprobante_estado_cuenta'];
        const userDocs = user.documents.map(doc => doc.name);
        
        const missingDocs = requiredDocs.filter(doc => !userDocs.includes(doc));
        
        if (missingDocs.length > 0) {
          return res.status(400).json({ error: `Faltan los siguientes documentos: ${missingDocs.join(', ')}` });
        }
        
        user.role = 'premium';
      } else {
        return res.status(400).json({ error: 'Operación no permitida para este rol de usuario' });
      }
  
      await user.save();
  
      res.json({ message: `Usuario actualizado a ${user.role}`, user });
    } catch (error) {
      console.error('Error al actualizar usuario a premium:', error);
      res.status(500).json({ error: 'Error al actualizar usuario' });
    }
  }


  async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await UserModel.findOne({ email });

      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      await UserModel.findByIdAndUpdate(user._id, { last_connection: new Date() });

      const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      res.status(200).json({ message: 'Inicio de sesión exitoso', token });
    } catch (error) {
      logger.error('Error in login:', error);
      res.status(500).json({ message: 'Error en el servidor' });
    }
  }

  async uploadDocuments(req, res) {
    try {
      const { uid } = req.params;
      const user = await UserModel.findById(uid);
  
      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
  
      if (req.files) {
        for (let fileType in req.files) {
          req.files[fileType].forEach(file => {
            // Buscar si ya existe un documento con este nombre
            const existingDocIndex = user.documents.findIndex(doc => doc.name === fileType);
            
            if (existingDocIndex !== -1) {
              // Si existe, actualizar la referencia
              user.documents[existingDocIndex].reference = file.path;
            } else {
              // Si no existe, agregar nuevo documento
              user.documents.push({
                name: fileType,
                reference: file.path
              });
            }
          });
        }
      }
  
      await user.save();
      res.json({ message: 'Documentos subidos con éxito', user });
    } catch (error) {
      console.error('Error al subir documentos:', error);
      res.status(500).json({ error: 'Error al subir documentos', details: error.message });
    }
  }

  async logout(req, res) {
    if (req.user) {
      await UserModel.findByIdAndUpdate(req.user._id, { last_connection: new Date() });
    }
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