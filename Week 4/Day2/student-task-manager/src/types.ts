
export type Priority = "Low" | "Medium" | "High";

export type TaskStatus = "Pending" | "Completed";

export interface Task {
  id: number;
  title: string;
  priority: Priority;
  status: TaskStatus;
}

export interface Student {
  id: number;
  name: string;
  email: string;
}
