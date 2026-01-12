export interface Task {
  id: string | number;
  name: string;
  status?: string;
  description?: string;
  logs?: string[];
  output?: string;
}

export interface TaskLog {
  id: string | number;
  message: string;
  timestamp: string;
}
