import userDao from '../dao/userDao.js';
import bcrypt from 'bcrypt';
import logger from '../utils/logger.js';

class UserService {
  async findByEmail(email) {
    return userDao.findByEmail(email);
  }

  async findById(id) {
    return userDao.findById(id);
  }

  async register(userData) {
    try {
      console.log("Contraseña original:", userData.password);
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      console.log("Contraseña hasheada:", hashedPassword);
      const newUser = await userDao.create({ ...userData, password: hashedPassword });
      logger.info('New user registered:', newUser);
      return newUser;
    } catch (error) {
      logger.error('Error registering new user:', error);
      throw error;
    }
  }

  async updateUserProfile(id, userData) {
    try {
      const updatedUser = await userDao.update(id, userData);
      logger.info('User profile updated:', updatedUser);
      return updatedUser;
    } catch (error) {
      logger.error('Error updating user profile:', error);
      throw error;
    }
  }

async login(email, password) {
  const user = await userDao.findByEmail(email);
  if (!user) {
    throw new Error('Usuario no encontrado');
  }
  console.log("Contraseña ingresada:", password);
  console.log("Contraseña hasheada en BD:", user.password);
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Contraseña incorrecta');
  }
  return user;
}

  async findOrCreateGithubUser(profile) {
    let user = await userDao.findByGithubId(profile.id);
    if (!user) {
      const userData = {
        githubId: profile.id,
        name: profile.displayName || profile.username || 'Usuario de GitHub',
        email: profile.emails && profile.emails[0] ? profile.emails[0].value : `${profile.id}@github.com`,
      };
      user = await userDao.create(userData);
    }
    return user;
  }


}

export default new UserService();