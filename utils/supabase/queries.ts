import { createClient } from "./browser-client";
import { QueryData } from "@supabase/supabase-js";

export const getHomePosts = async (supabase: ReturnType<typeof createClient>) => { 
  
  return await supabase
    .from("posts")
    .select("id, title, slug, users(username)")
    .order("created_at", { ascending: false });
};

export const getSinglePost = async (slug: string) => {
  const supabase = createClient();  
  return await supabase
    .from("posts")
    .select("id, title, slug, content, images, user_id, users(username)")
    .eq("slug", slug)
    .single();
};

export const searchPosts = async (query: string) => {
  const supabase = createClient();
  return await supabase
    .from("posts")
    .select("id, title, slug, users(username)")
    .ilike("title", `%${query}%`)
    .limit(10);
};

export const getCommentsByPostId = async (postId: number) => {
  const supabase = createClient();
  return await supabase
    .from("comments")
    .select("id, content, created_at, updated_at, user_id, users(username)")
    .eq("post_id", postId)
    .order("created_at", { ascending: true });
};

export type HomePostType = QueryData<ReturnType<typeof getHomePosts>>;
export type SinglePostType = QueryData<ReturnType<typeof getSinglePost>>;
export type SearchPostType = QueryData<ReturnType<typeof searchPosts>>;
export type CommentType = QueryData<ReturnType<typeof getCommentsByPostId>>;