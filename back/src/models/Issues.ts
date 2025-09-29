import { IIssue } from "../types/ModelInterfaces/IIssue";
import mongoose, { Schema } from "mongoose";
import { Priority, Status } from "../types/enums/enums";

const issueSchema: Schema<IIssue> = new Schema(
  {
    title: { type: String, required: true, minlength: 3, maxlength: 100 },
    description: { type: String },
    status: {
      type: String,
      enum: Object.values(Status),
      default: Status.OPEN,
    },
    priority: {
      type: String,
      enum: Object.values(Priority),
      default: Priority.MEDIUM,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model<IIssue>("Issue", issueSchema);
