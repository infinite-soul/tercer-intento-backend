import express from 'express';
import { isAuthenticated, isAdmin } from '../middlewares/auth.middleware.js';
import UserController from '../controllers/authController.js';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// Configuración de Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let folder;
    if (file.fieldname === 'profile') {
      folder = 'profiles';
    } else if (file.fieldname === 'product') {
      folder = 'products';
    } else {
      folder = 'documents';
    }
    cb(null, `uploads/${folder}`);
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

router.put('/premium/:uid', isAuthenticated, isAdmin, UserController.updateUserToPremium);

router.post('/:uid/documents', isAuthenticated, upload.fields([
    { name: 'profile', maxCount: 1 },
    { name: 'identificacion', maxCount: 1 },
    { name: 'comprobante_domicilio', maxCount: 1 },
    { name: 'comprobante_estado_cuenta', maxCount: 1 }
  ]), UserController.uploadDocuments);

export default router;