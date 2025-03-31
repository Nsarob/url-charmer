import User from "../../../database/models/user";
import { UserResponseDTO } from "../auth.types";

const googleAuthCallback = (user: User): UserResponseDTO => {
  const response: UserResponseDTO = {
    id: user.id.toString(),
    username: user.username,
  };

  return response;
};

const googleAuthService = {
  googleAuthCallback
}

export default googleAuthService;