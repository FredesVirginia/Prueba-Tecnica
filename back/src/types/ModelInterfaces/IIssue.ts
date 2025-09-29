import { Document } from "mongoose";

import { IUser } from "./IUser";
import { Priority, Status } from "../enums/enums";


export interface IIssue extends Document {
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  createdBy: IUser["_id"];
  assignedTo?: IUser["_id"];
  createdAt: Date;
  updatedAt: Date;
}