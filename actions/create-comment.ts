"use server";

import { z } from "zod";
import { commentSchema } from "./schemas";
import { createClient } from "../utils/supabase/server-client";
import { TablesInsert } from "../utils/supabase/database.types";

export type CreateCommentInput = z.infer<typeof commentSchema>;

export type CreateCommentResult =
  | { success: true; commentId: number }
  | { success: false; error: string };

export const createComment = async (input: CreateCommentInput): Promise<CreateCommentResult> => {
  try {
    const parsedData = commentSchema.parse(input);
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("comments")
      .insert([
        {
          post_id: parsedData.post_id,
          user_id: parsedData.user_id,
          content: parsedData.content.trim(),
        } as TablesInsert<'comments'>
      ])
      .select("id")
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, commentId: data.id };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0]?.message || "Invalid input." };
    }
    return { success: false, error: "Failed to create comment." };
  }
}
