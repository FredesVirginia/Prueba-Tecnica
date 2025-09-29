import { Priority, Status } from "../enums/enums";


export interface IssueDto {
    title: string;
    description: string;
    status: Status;
    assignedTo: string;
    createdBy: string;
    priority: Priority;
}

export interface UpdateIssueDto {
    title?: string;
    description?: string;
    status?: Status;
    assignedTo?: string;
    priority?: Priority;
}
export interface UpdateIssueAssignmentDto{
   
    assignedTo: string;
}