import { DefaultUser } from "next-auth";
import mongoose, { Schema } from "mongoose";
declare module "next-auth" {
  interface Session {
    user?: DefaultUser & { id: string; role: string };
  }
  interface User extends DefaultUser {
    _id: Schema.Types.ObjectId;
    isNewFirstLogin: boolean;
  }
}
