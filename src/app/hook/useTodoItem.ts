import { useState, useEffect } from "react";
import { List } from "../../../types/list";

export function useGetItems() {
  const [todos, setTodos] = useState<List[]>([]);

  const fetchTodos = async (searchQuery?: string, status?: string) => {
    try {
      const url = `/api/todo${searchQuery ? `?search=${searchQuery}` : ""}${
        status ? `${searchQuery ? "&" : "?"}status=${status}` : ""
      }`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch todos");
      }
      const data = await response.json();
      setTodos(data.data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Error fetching todos:", err.message);
      } else {
        console.error("Unknown error fetching todos");
      }
    }
  };
  useEffect(() => {
    fetchTodos();
  }, []);
  return { todos, refetch: fetchTodos };
}

export function usePostItems(todo: string) {
  const createTodoList = async () => {
    return await fetch("api/todo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ todo }),
    });
  };
  return { createTodoList };
}

export function useDeleteItem() {
  const deleteTodoItem = async (id: string) => {
    return await fetch(`api/todo/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
  };
  return { deleteTodoItem };
}

export function usePutItem() {
  const updateTodoItem = async (List: List, id: string) => {
    return await fetch(`api/todo/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(List),
    });
  };

  return { updateTodoItem };
}

export function useGetItem() {
  const [value, setValue] = useState<List | null>(null);
  const getSingleTodoList = async (id: string) => {
    const data = await fetch(`api/todo/${id}`);
    const res = await data.json();
    setValue(res.data);
    return res.data;
  };

  return { value, setValue, getSingleTodoList };
}

export function useUpdateStatus() {
  const markStatus = async (id: string, status: boolean) => {
    return await fetch(`api/todo/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ isCompleted: status }),
    });
  };
  return { markStatus };
}
