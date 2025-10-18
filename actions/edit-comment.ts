"use server";

import { z } from "zod";
import { editCommentSchema } from "./schemas";
import { createClient } from "../utils/supabase/server-client";
import { revalidatePath } from "next/cache";

export type EditCommentInput = z.infer<typeof editCommentSchema>;

export type EditCommentResult =
  | { success: true }
  | { success: false; error: string };

export const editComment = async (input: EditCommentInput): Promise<EditCommentResult> => {
  try {
    const parsedData = editCommentSchema.parse(input);
    const supabase = await createClient();

    const { error } = await supabase
      .from("comments")
      .update({ 
        content: parsedData.content.trim(),
        updated_at: new Date().toISOString()
      })
      .eq("id", parsedData.comment_id);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/[slug]", "page");
    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0]?.message || "Invalid input." };
    }
    return { success: false, error: "Failed to edit comment." };
  }
};
