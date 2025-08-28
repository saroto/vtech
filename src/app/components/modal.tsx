import { useEffect, useState } from "react";
import { List, Mode } from "../../../types/list";
import { usePostItems, useGetItem, usePutItem } from "../hook/useTodoItem";

interface ModalProp {
  isOpen: boolean;
  todoId: string;
  onClose: () => void;
  mode: Mode;
  refetchData: () => Promise<void>;
}
export default function Modal(ModalProp: ModalProp) {
  const [todo, setTodo] = useState("");
  const { createTodoList } = usePostItems(todo);
  const {
    getSingleTodoList,
    value: editValue,
    setValue: setEditValue,
  } = useGetItem();
  const { updateTodoItem } = usePutItem();

  useEffect(() => {
    async function fetchTodo() {
      await getSingleTodoList(ModalProp.todoId);
    }
    fetchTodo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ModalProp.todoId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (ModalProp.mode === "add") {
      if (todo.trim() === "") {
        alert("Todo cannot be empty");
        return;
      }
      const create = await createTodoList();

      if (create.status === 400) {
        return alert("Todo already exists");
      } else {
        setTodo("");
        await ModalProp.refetchData();
        ModalProp.onClose();
        return alert("Todo added successfully");
      }
    } else {
      const todoToUpdate: List = {
        id: editValue?.id || "",
        todo: editValue?.todo || "",
        isCompleted: editValue?.isCompleted || false,
        createdAt: new Date().toISOString(),
      };

      const update = await updateTodoItem(todoToUpdate, ModalProp.todoId);
      if (update.status === 400) {
        return alert("Todo already exists");
      } else {
        alert("Todo updated successfully");
        await ModalProp.refetchData();
        setEditValue(null);
        ModalProp.onClose();
      }
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-opacity-50"
      style={{ display: ModalProp.isOpen ? "flex" : "none" }}
    >
      <form onSubmit={handleSubmit}>
        <div className="bg-white p-6 rounded shadow-lg">
          <h2 className="text-xl font-bold mb-4">
            {ModalProp.mode === "edit" ? "Edit Todo" : "Add Todo"}
          </h2>
          {ModalProp.mode === "add" ? (
            <input
              type="text"
              value={todo}
              onChange={(e) => setTodo(e.target.value)}
              placeholder="Enter todo"
              className="border border-gray-300 p-2 w-full mb-4"
            />
          ) : (
            <>
              {editValue && (
                <div>
                  <input
                    type="text"
                    value={editValue.todo}
                    onChange={(e) =>
                      setEditValue({
                        ...editValue,
                        todo: e.target.value,
                      } as List)
                    }
                    placeholder="Enter todo"
                    className="border border-gray-300 p-2 w-full mb-4 focus:outline-none"
                  />

                  <div className="flex items-center mb-4">
                    <input
                      type="radio"
                      checked={editValue.isCompleted === true}
                      value={"true"}
                      onChange={() =>
                        setEditValue({
                          ...editValue,
                          isCompleted: true,
                        } as List)
                      }
                    />
                    <label className="mr-4">Completed:</label>

                    <input
                      type="radio"
                      checked={editValue.isCompleted === false}
                      value={"false"}
                      onChange={() =>
                        setEditValue({
                          ...editValue,
                          isCompleted: false,
                        } as List)
                      }
                    />
                    <label className="mr-4">InCompleted:</label>
                  </div>
                </div>
              )}
            </>
          )}
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded mr-2 cursor-pointer disabled:opacity-50"
            // disabled={todo.trim() === ""}
            type="submit"
          >
            {ModalProp.mode === "edit" ? "Update" : "Add"}
          </button>
          <button
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
            onClick={ModalProp.onClose}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
