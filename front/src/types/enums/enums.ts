export const Status = {
  OPEN: "open",
  IN_PROGRESS: "in_progress",
  CLOSED: "closed",
} as const;

export const Priority = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
} as const;


export type StatusType = typeof Status[keyof typeof Status];
export type PriorityType = typeof Priority[keyof typeof Priority];