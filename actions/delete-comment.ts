"use server";

import { createClient } from "../utils/supabase/server-client";
import { revalidatePath } from "next/cache";

export type DeleteCommentResult =
  | { success: true }
  | { success: false; error: string };

export const deleteComment = async (commentId: number): Promise<DeleteCommentResult> => {
  try {
    const supabase = await createClient();

    const { data: existingComment, error: fetchError } = await supabase
      .from("comments")
      .select("id")
      .eq("id", commentId)
      .single();

    if (fetchError || !existingComment) {
      return { success: false, error: "Comment not found" };
    }

    const { error } = await supabase
      .from("comments")
      .delete()
      .eq("id", commentId);

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/[slug]", "page");
    return { success: true };
  } catch (error) {
    console.error("Delete comment error:", error);
    return { success: false, error: "Failed to delete comment." };
  }
};
