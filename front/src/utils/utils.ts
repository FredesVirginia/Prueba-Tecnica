import { Priority, Status } from "../types/enums/enums";

 export const getStatusColor = (status: string) => {
    switch (status) {
      case Status.OPEN:
        return "green";
      case Status.IN_PROGRESS:
        return "orange";
      case Status.CLOSED:
        return "red";
      default:
        return "blue";
    }
  };

  export const getPriorityColor = (priority: string) => {
    switch (priority) {
      case Priority.LOW:
        return "green";
      case Priority.MEDIUM:
        return "orange";
      case Priority.HIGH:
        return "red";
      default:
        return "blue";
    }
  };