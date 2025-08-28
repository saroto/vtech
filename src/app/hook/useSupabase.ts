"use server";
import { createClient } from "../../../utils/supabase/server";
import { List } from "../../../types/list";
export async function GetAllTodo() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("todo").select("*");
  if (error) {
    return { data: null, error: error.message };
  }
  return { data, error: null };
}

export async function GetSingleTodo(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("todo")
    .select("*")
    .eq("id", id)
    .single();
  if (error) {
    return { data: null, error: error.message };
  }
  return { data, error: null };
}

export async function PostTodo(todo: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("todo")
    .insert({ todo, isCompleted: false });
  if (error) {
    return { data: null, error: error.message };
  }
  return { data, error: null };
}

export async function updateTodoItem(
  todo: string,
  isCompleted: boolean,
  id: string
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("todo")
    .update({ todo, isCompleted })
    .eq("id", id);
  if (error) {
    return { data: null, error: error.message };
  }
  return { data, error: null };
}
