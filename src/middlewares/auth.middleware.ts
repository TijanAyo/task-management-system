import { Request, Response, NextFunction } from "express";
import jwt, {
  JsonWebTokenError,
  JwtPayload,
  TokenExpiredError,
} from "jsonwebtoken";
import { User, Role, Permission } from "../models";

declare module "express-serve-static-core" {
  interface Request {
    user?: User;
  }
}

export const authorize = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token;
  const secret = String(process.env.JWT_SECRET);
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      if (!token) {
        return res.status(401).json({
          error: "BAD_REQUEST_ERR",
          message: "Authentication required, Kindly provide a valid token",
          success: false,
        });
      }

      const decoded = jwt.verify(token, secret) as JwtPayload;
      const user = await User.findByPk(decoded.userId, {
        attributes: { exclude: ["password"] },
        include: [
          {
            model: Role,
            attributes: ["id", "title"],
            include: [
              {
                model: Permission,
                attributes: ["title"],
              },
            ],
          },
        ],
      });

      if (!user) {
        return res.status(404).json({
          error: "NOT_FOUND_ERR",
          message: "User not found",
          success: false,
        });
      }

      req.user = user.toJSON();
      next();
    } catch (error) {
      console.error("authorizeMiddlewareError:", error);

      if (error instanceof TokenExpiredError) {
        return res.status(400).json({
          error: "BAD_REQUEST_ERR",
          message: "Token expired",
          success: false,
        });
      }

      if (error instanceof JsonWebTokenError) {
        console.log("JSONWEBTokenError: Invalid token signature");
        return res.status(400).json({
          error: "BAD_REQUEST_ERR",
          message: "Invalid token",
          success: false,
        });
      }

      return res.status(401).json({
        error: "UNAUTHORIZED_ERR    ",
        message: "Invalid token",
        success: false,
      });
    }
  } else {
    return res.status(403).json({
      message: "Authorization required, token is required",
      success: false,
    });
  }
};
