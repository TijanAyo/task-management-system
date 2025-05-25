import { User } from "../models/user";
import { IRegisterPayload } from "../helpers/interface";
import { AppError, AppResponse } from "../helpers";
import bcrypt from "bcrypt";

export class AuthService {
  private readonly SALT_ROUND = Number(process.env.SALT_ROUND);

  async register(payload: IRegisterPayload) {
    try {
      const existingUser = await User.findOne({
        where: {
          email: payload.email,
        },
      });

      if (existingUser) {
        throw AppError.badRequest("User already exists");
      }

      if (payload.password !== payload.confirmPassword) {
        throw AppError.badRequest("Incorrect password combination");
      }

      const hashedPassword = await this.hashPayload(payload.password);

      await User.create({
        email: payload.email,
        password: hashedPassword,
      });

      return AppResponse("User created successfully");
    } catch (error: any) {
      throw error;
    }
  }

  async login() {}

  private async hashPayload(data: string) {
    return await bcrypt.hash(data, this.SALT_ROUND);
  }

  private async compareHash(payload: string, hashedPayload: string) {
    return await bcrypt.compare(payload, hashedPayload);
  }
}
