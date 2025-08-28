"use client";
import { createClient } from "../../../utils/supabase/client";
import { useEffect, useState } from "react";
interface EditRealtimeProps {
  isOpen: boolean;
  onClose: () => void;
  todoId: string;
}

export default function EditRealtime(props: EditRealtimeProps) {
  const supabase = createClient();
  const [todo, setTodo] = useState({
    id: "",
    todo: "",
    isCompleted: false,
  });

  useEffect(() => {
    if (props.isOpen) {
      const getData = async () => {
        const { data, error } = await supabase
          .from("todo")
          .select("*")
          .eq("id", props.todoId)
          .single();
        if (error) {
          alert("Error fetching todo: " + error.message);
          return;
        }
        setTodo(data);
      };
      getData();
    }
  }, [props.isOpen, props.todoId, supabase]); // Added props.todoId to dependencies

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (todo.todo.trim() === "") {
      alert("Todo cannot be empty");
      return;
    }

    const { error } = await supabase
      .from("todo")
      .update({ todo: todo.todo, isCompleted: todo.isCompleted })
      .eq("id", todo.id);
    if (error) {
      alert("Todo already exists");
      return;
    }
    alert("Todo updated successfully");

    props.onClose();
  };
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-opacity-50"
      style={{ display: props.isOpen ? "flex" : "none" }}
    >
      <div
        className="bg-white p-6 rounded shadow-lg"
        style={{ display: props.isOpen ? "block" : "none" }}
      >
        <h2 className="text-xl font-bold mb-4">Edit Todo</h2>
        <form onSubmit={handleUpdate}>
          {todo && (
            <div>
              <input
                className="border border-gray-300 p-2 rounded w-full"
                type="text"
                name="todo"
                placeholder="Edit your todo"
                value={todo.todo}
                onChange={(e) => setTodo({ ...todo, todo: e.target.value })}
              />
              <input
                type="radio"
                name="status"
                checked={todo.isCompleted === true}
                onChange={() => setTodo({ ...todo, isCompleted: true })}
              />{" "}
              Completed
              <input
                type="radio"
                name="status"
                checked={todo.isCompleted === false}
                onChange={() => setTodo({ ...todo, isCompleted: false })}
              />{" "}
              Incomplete
            </div>
          )}
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
              onClick={props.onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
