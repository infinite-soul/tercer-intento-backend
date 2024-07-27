import userDao from '../dao/userDao.js';
import bcrypt from 'bcrypt';

class UserService {
  async findByEmail(email) {
    return userDao.findByEmail(email);
  }

  async findById(id) {
    return userDao.findById(id);
  }

  async register(userData) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    return userDao.create({ ...userData, password: hashedPassword });
  }

  async login(email, password) {
    const user = await userDao.findByEmail(email);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
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

  async updateUserProfile(id, userData) {
    return userDao.update(id, userData);
  }
}

export default new UserService();