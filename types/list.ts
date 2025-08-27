export interface List {
  id: string;
  todo: string;
  isCompleted: boolean;
  createdAt: string;
}

export type Mode = "edit" | "add";
