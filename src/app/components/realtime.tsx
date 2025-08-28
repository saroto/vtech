"use client";
import { useEffect, useState } from "react";
import { List } from "../../../types/list";
import { createClient } from "../../../utils/supabase/client";
import EditRealtime from "./editRealtime";

export default function Realtime({ data }: { data: List[] }) {
  const [todos, setTodos] = useState<List[]>(data);
  const [newTodo, setNewTodo] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [editTodoId, setEditTodoId] = useState("");
  const supabase = createClient();
  useEffect(() => {
    const realtime = supabase
      .channel("todos")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "todo",
        },
        (payload) => {
          setTodos((prev) => {
            if (payload.eventType === "INSERT") {
              return [...prev, payload.new] as List[];
            } else if (payload.eventType === "UPDATE") {
              return prev.map((todo) =>
                todo.id === payload.new.id ? payload.new : todo
              ) as List[];
            } else if (payload.eventType === "DELETE") {
              return prev.filter(
                (todo) => todo.id !== payload.old.id
              ) as List[];
            } else {
              return prev;
            }
          });
        }
      )
      .subscribe();
    return () => {
      realtime.unsubscribe();
    };
  }, [supabase]);
  const handleCreateTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo.trim() === "") {
      alert("Todo cannot be empty");
      return;
    }
    if (todos.find((todo) => todo.todo === newTodo.trim())) {
      alert("Todo already exists");
      return;
    }

    const { error } = await supabase
      .from("todo")
      .insert({ todo: newTodo, isCompleted: false });
    if (error) {
      alert("Error creating todo: " + error.message);
      return;
    }
    setNewTodo("");
  };

  return (
    <div className="p-4">
      <EditRealtime
        isOpen={isEdit}
        onClose={() => setIsEdit(false)}
        todoId={editTodoId}
      />
      <h1>Real-time Todo List</h1>
      <form className="mb-4" onSubmit={handleCreateTodo}>
        <input
          type="text"
          placeholder="Type your todo"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          className="border border-gray-300 p-2 w-[20%] mb-4"
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded ml-2"
          type="submit"
        >
          Add Todo
        </button>
      </form>
      {todos.length === 0 ? (
        <p>No todos available</p>
      ) : (
        <>
          <table className="table-auto border-collapse border border-gray-400 w-full">
            <thead>
              <tr>
                <th className="border border-gray-400 px-2 py-1">ID</th>
                <th className="border border-gray-400 px-2 py-1">Todo</th>
                <th className="border border-gray-400 px-2 py-1">
                  Is Completed
                </th>
                <th className="border border-gray-400 px-2 py-1">Created At</th>
                <th className="border border-gray-400 px-2 py-1">Action</th>
              </tr>
            </thead>
            <tbody>
              {todos.map((todo, index) => (
                <tr
                  key={index}
                  className={todo.isCompleted ? "line-through" : ""}
                >
                  <td className="border border-gray-400 px-2 py-1">
                    {todo.id}
                  </td>
                  <td className="border border-gray-400 px-2 py-1">
                    {todo.todo}
                  </td>
                  <td className="border border-gray-400 px-2 py-1">
                    {todo.isCompleted ? "Completed" : "Incompleted"}
                  </td>
                  <td className="border border-gray-400 px-2 py-1">
                    {todo.createdAt.toLocaleString()}
                  </td>

                  <td className="border border-gray-400 px-2 py-1">
                    <button
                      className="mr-2 cursor-pointer"
                      onClick={() => {
                        setIsEdit(true);
                        setEditTodoId(todo.id);
                      }}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
