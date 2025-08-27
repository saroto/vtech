"use client";

import { useState } from "react";
import { Mode } from "../../types/list";
import Modal from "@/app/components/modal";
import {
  useGetItems,
  useDeleteItem,
  useUpdateStatus,
} from "./hook/useTodoItem";

export default function TodoPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("add");
  const [todoId, setTodoId] = useState("");

  const handleOpenModal = (mode: Mode) => {
    setMode(mode);
    setIsModalOpen(true);
  };
  // hooks
  const { todos: todosList, refetch } = useGetItems();
  const { deleteTodoItem } = useDeleteItem();
  const { markStatus } = useUpdateStatus();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    refetch(e.target.value);
  };

  const handleDelete = async (id: string) => {
    const response = await deleteTodoItem(id);
    if (response.status === 200) {
      alert("Todo deleted successfully");
      await refetch();
    } else {
      const errorData = await response.json();
      alert(`Error deleting todo: ${errorData.error}`);
    }
  };
  const handleMarkComplete = async (id: string) => {
    const maskAsCompleteResponse = await markStatus(id, true);
    if (maskAsCompleteResponse.status === 200) {
      alert("Todo marked as complete");
      await refetch();
    }
  };
  const handleMarkInComplete = async (id: string) => {
    const maskAsInCompleteResponse = await markStatus(id, false);
    if (maskAsInCompleteResponse.status === 200) {
      alert("Todo marked as incomplete");
      await refetch();
    }
  };

  return (
    <>
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          refetchData={refetch}
          mode={mode as Mode}
          todoId={todoId}
        />
      )}
      <div className="container mx-auto ">
        <div className="flex justify-between items-center mb-4">
          <h1>Todo List</h1>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded mb-4 cursor-pointer"
            onClick={() => handleOpenModal("add")}
          >
            Add Todo
          </button>
          <input
            type="text"
            placeholder="Search todos..."
            className="border border-gray-300 p-2 rounded mb-4"
            // value={search}
            onChange={(e) => {
              handleSearchChange(e);
            }}
          />
        </div>
        <table className="table-auto border-collapse border border-gray-400 w-full">
          <thead>
            <tr>
              <th className="border border-gray-400 px-2 py-1">ID</th>
              <th className="border border-gray-400 px-2 py-1">Todo</th>
              <th className="border border-gray-400 px-2 py-1">Completed</th>
              <th className="border border-gray-400 px-2 py-1">Created At</th>
              <th className="border border-gray-400 px-2 py-1">Action</th>
              <th className="border border-gray-400 px-2 py-1">Status</th>
            </tr>
          </thead>
          {todosList.length !== 0 ? (
            <tbody>
              {todosList.map((todo) => (
                <tr
                  key={todo.id}
                  className={todo.isCompleted ? "line-through" : ""}
                >
                  <td className="border border-gray-400 px-2 py-1">
                    {todo.id}
                  </td>
                  <td className="border border-gray-400 px-2 py-1">
                    {todo.todo}
                  </td>
                  <td className="border border-gray-400 px-2 py-1">
                    {todo.isCompleted ? "Yes" : "No"}
                  </td>
                  <td className="border border-gray-400 px-2 py-1">
                    {new Date(todo.createdAt).toLocaleString()}
                  </td>
                  <td className="border border-gray-400 px-2 py-1">
                    <button
                      className="bg-blue-500 text-white px-2 py-1 rounded"
                      onClick={() => {
                        handleOpenModal("edit");
                        setTodoId(todo.id);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded ml-2"
                      onClick={() => handleDelete(todo.id)}
                    >
                      Delete
                    </button>
                  </td>
                  <td className="border border-gray-400 px-2 py-1">
                    <button
                      className="bg-green-400 text-white px-2 py-1 rounded ml-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={todo.isCompleted}
                      onClick={() => handleMarkComplete(todo.id)}
                    >
                      Mark as Complete
                    </button>
                    <button
                      className="bg-yellow-400 text-white px-2 py-1 rounded ml-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={!todo.isCompleted}
                      onClick={() => handleMarkInComplete(todo.id)}
                    >
                      Mark as Incomplete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          ) : (
            <tbody>
              <tr>
                <td colSpan={6} className="text-center py-4">
                  No result. Create a new one instead!
                </td>
              </tr>
            </tbody>
          )}
        </table>
      </div>
    </>
  );
}
