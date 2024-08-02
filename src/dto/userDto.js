class UserDto {
    constructor(user) {
      this.id = user._id;
      this.name = user.name;
      this.email = user.email;
      this.role = user.role;
      this.createdAt = user.createdAt;
      this.lastLogin = user.lastLogin;
    }
  }
  
  export default UserDto;