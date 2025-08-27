import { List } from "../types/list";
import { generatedUUID } from "../utils/generateUuid";
export const todosList: List[] = [
  {
    id: generatedUUID(),
    todo: "Learn Next.js",
    isCompleted: false,
    createdAt: "2023-10-01T12:00:00Z",
  },
  {
    id: generatedUUID(),
    todo: "Build a portfolio website",
    isCompleted: false,
    createdAt: "2023-10-02T09:30:00Z",
  },
  {
    id: generatedUUID(),
    todo: "Read about React Server Components",
    isCompleted: true,
    createdAt: "2023-10-03T15:45:00Z",
  },
  {
    id: generatedUUID(),
    todo: "Practice TypeScript",
    isCompleted: false,
    createdAt: "2023-10-04T08:20:00Z",
  },
  {
    id: generatedUUID(),
    todo: "Explore Tailwind CSS",
    isCompleted: true,
    createdAt: "2023-10-05T18:10:00Z",
  },
  {
    id: generatedUUID(),
    todo: "Set up a personal blog",
    isCompleted: false,
    createdAt: "2023-10-06T11:00:00Z",
  },
  {
    id: generatedUUID(),
    todo: "Deploy project on Vercel",
    isCompleted: false,
    createdAt: "2023-10-07T14:25:00Z",
  },
];
