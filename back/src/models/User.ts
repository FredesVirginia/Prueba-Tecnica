import { IUser } from "../types/ModelInterfaces/IUser";
import mongoose, { Schema } from "mongoose";

const userSchema: Schema<IUser> = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

export default mongoose.model<IUser>("User", userSchema);
