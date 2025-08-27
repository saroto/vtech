import { createClient } from "../../../utils/supabase/server";
import Realtime from "@/app/components/realtime";
export default async function BounsChallenge() {
  const supabase = await createClient();

  const { data: todo, error } = await supabase.from("todo").select("*");

  return (
    <div>
      <Realtime data={todo ?? []} />
    </div>
  );
}
