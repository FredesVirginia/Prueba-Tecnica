export interface IResIssues {
    issues:     Issue[];
    pagination: Pagination;
}

export interface Issue {
    _id:         string;
    title:       string;
    description: string;
    status:      string;
    priority:    string;
    createdBy:   AssignedTo | null;
    assignedTo:  AssignedTo | null;
    createdAt:   Date;
    updatedAt:   Date;
    __v:         number;
}

export interface IssueId{
    issue : Issue
}

export interface AssignedTo {
    _id:   string;
    name:  string;
    email: string;
}

export interface Pagination {
    currentPage:   number;
    totalPages:    number;
    totalIssues:   number;
    issuesPerPage: number;
    hasNextPage:   boolean;
    hasPrevPage:   boolean;
    nextPage:      null;
    prevPage:      number;
}
export interface IresIssuesFilter {
    success:    boolean;
    data:       Issue[];
    pagination: Pagination;
   
}

