import { User, Role } from "../models";
import { ILoginPayload, IRegisterPayload } from "../helpers/interface";
import { AppError, AppResponse } from "../helpers";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export class AuthService {
  private readonly SALT_ROUND = Number(process.env.SALT_ROUND);
  private readonly JWT_SECRET = String(process.env.JWT_SECRET);
  private readonly JWT_EXPIRES_IN = Number(process.env.JWT_EXPIRES_IN);

  async register(payload: IRegisterPayload) {
    try {
      const existingUser = await User.findOne({
        where: {
          email: payload.email,
          deletedFlag: false,
        },
      });

      if (existingUser) {
        throw AppError.badRequest("User already exists");
      }

      if (payload.password !== payload.confirmPassword) {
        throw AppError.badRequest("Incorrect password combination");
      }

      const hashedPassword = await this.hashPayload(payload.password);
      const defaultRole = await Role.findOne({ where: { title: "user" } });

      await User.create({
        email: payload.email.toLowerCase(),
        password: hashedPassword,
        roleId: defaultRole!.id,
      });

      return AppResponse("User created successfully");
    } catch (error: any) {
      throw error;
    }
  }

  async login(payload: ILoginPayload) {
    try {
      const user = await User.findOne({
        where: {
          email: payload.email,
          deletedFlag: false,
        },
      });

      if (!user) {
        throw AppError.notFound("Invalid email or password provided");
      }

      const passwordMatch = await this.compareHash(
        payload.password,
        user.password
      );

      if (!passwordMatch) {
        throw AppError.badRequest("Invalid email or passoword provided");
      }

      const token = this.generateAccessToken(user.id);

      return AppResponse("login successful", { accessToken: token });
    } catch (error: any) {
      throw error;
    }
  }

  private async hashPayload(data: string) {
    return await bcrypt.hash(data, this.SALT_ROUND);
  }

  private async compareHash(payload: string, hashedPayload: string) {
    return await bcrypt.compare(payload, hashedPayload);
  }

  private generateAccessToken(userId: number) {
    const payload = { userId };
    return jwt.sign(payload, this.JWT_SECRET, {
      expiresIn: Number(this.JWT_EXPIRES_IN),
    });
  }
}
