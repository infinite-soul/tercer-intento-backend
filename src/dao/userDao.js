import { UserModel } from '../dao/MongoDB/User.model.js';

class UserDao {
  async findByEmail(email) {
    return UserModel.findOne({ email });
  }

  async findById(id) {
    return UserModel.findById(id);
  }

  async create(userData) {
    const newUser = new UserModel(userData);
    return newUser.save();
  }

  async update(id, userData) {
    return UserModel.findByIdAndUpdate(id, userData, { new: true });
  }

  async findByGithubId(githubId) {
    return UserModel.findOne({ githubId });
  }
}

export default new UserDao();