import { todosList } from "../../../../../data/todos-list";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) {
    return new Response(JSON.stringify({ error: "ID is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
  const todo = todosList.find((item) => item.id === id);
  if (todo) {
    return new Response(
      JSON.stringify({
        data: todo,
        message: "Successfully get todo list",
        status: 200,
      })
    );
  } else {
    return new Response(
      JSON.stringify({
        error: "Todo list not found",
        status: 404,
      })
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  console.log(id);
  if (!id) {
    return new Response(JSON.stringify({ error: "ID is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
  const index = todosList.findIndex((item) => item.id === id);
  if (index !== -1) {
    todosList.splice(index, 1);
    return new Response(
      JSON.stringify({ message: "Todo List delete successfully " }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } else {
    return new Response(JSON.stringify({ error: "Todo not found" }), {
      status: 404,
    });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { todo, isCompleted, createdAt } = await request.json();
  const index = todosList.findIndex((item) => item.id === id);
  if (index !== -1 && todo && typeof isCompleted === "boolean") {
    todosList[index] = {
      ...todosList[index],
      todo,
      isCompleted,
      createdAt,
    };
    return new Response(JSON.stringify(todosList[index]), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  return new Response(
    JSON.stringify({ error: "Todo not found or invalid data" }),
    {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { isCompleted } = await request.json();
  const { id } = await params;
  if (typeof isCompleted !== "boolean") {
    return new Response(
      JSON.stringify({ error: "Invalid data: isCompleted must be a boolean" }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
  const index = todosList.findIndex((item) => item.id === id);
  if (index !== -1) {
    todosList[index].isCompleted = isCompleted;
    return new Response(JSON.stringify(todosList[index]), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  return new Response(
    JSON.stringify({ error: "Todo not found or invalid data" }),
    {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}
