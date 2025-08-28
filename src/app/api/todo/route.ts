"use server";
import { todosList } from "../../../../data/todos-list";
import { NextRequest } from "next/server";
import { generatedUUID } from "../../../../utils/generateUuid";
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;

  const searchItem = params.get("search");
  const status = params.get("status");
  let filteredTodos = todosList;
  if (searchItem) {
    filteredTodos = filteredTodos.filter((item) =>
      item.todo.toLowerCase().includes(searchItem.toLowerCase())
    );
  }

  if (status) {
    const isCompleted = status === "complete";
    filteredTodos = filteredTodos.filter(
      (item) => item.isCompleted === isCompleted
    );
  }
  console.log("Filtered Todos:", filteredTodos); // Debugging line
  return new Response(
    JSON.stringify({
      data: filteredTodos,
      message: filteredTodos.length
        ? "Todos fetched successfully"
        : "No todos found",
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}

export async function POST(request: NextRequest) {
  const { todo } = await request.json();

  const newTodo = {
    id: generatedUUID(),
    todo,
    isCompleted: false,
    createdAt: new Date().toISOString(),
  };
  if (!todo) {
    return new Response(JSON.stringify({ error: "Todo cannot be empty" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  if (
    todosList.find((item) => item.todo.toLowerCase() === todo.toLowerCase())
  ) {
    return new Response(
      JSON.stringify({ error: "Todo already exists", status: 400 }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
  todosList.push(newTodo);
  return new Response(
    JSON.stringify({
      body: newTodo,
      message: "Todo added successfully",
      status: 200,
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}
