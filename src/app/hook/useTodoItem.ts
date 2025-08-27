import { useState, useEffect } from "react";
import { List } from "../../../types/list";

export function useGetItems() {
  const [todos, setTodos] = useState<List[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown | null>(null);
  const fetchTodos = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/todo");
      if (!response.ok) {
        throw new Error("Failed to fetch todos");
      }
      const data = await response.json();
      setTodos(data);
    } catch (err: unknown) {
      setError(err || "An error occurred");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchTodos();
  }, []);
  return { todos, loading, error, refetch: fetchTodos };
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
