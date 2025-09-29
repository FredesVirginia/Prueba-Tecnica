import type { PriorityType, StatusType } from "../../types/enums/enums";


export interface IReqIssue {
    title: string;
    description: string;
    status: StatusType;
    assignedTo: string;
    createdBy: string;
    priority: PriorityType;
}
export interface IReqUpdateIssue {
    title?: string;
    description?: string;
    status?: StatusType;
    assignedTo?: string;
    priority?: PriorityType;
}

export interface IssueFilters {
  status?: string;
  priority?: string;
  assignedTo?: string;
  createdBy?: string;
  title?: string;
  description?: string;
}
