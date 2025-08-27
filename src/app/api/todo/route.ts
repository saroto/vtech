import { todosList } from "../../../../data/todos-list";
import { NextRequest } from "next/server";
import { generatedUUID } from "../../../../utils/generateUuid";
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;

  const searchIterm = params.get("search");

  if (searchIterm) {
    const filteredTodos = todosList.filter((item) =>
      item.todo.toLowerCase().includes(searchIterm.toLowerCase())
    );
    return new Response(JSON.stringify(filteredTodos), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } else {
    return new Response(JSON.stringify(todosList), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
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
