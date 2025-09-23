import { create } from "domain";
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
    .select("id, title, slug, content, users(username)")
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

export type HomePostType = QueryData<ReturnType<typeof getHomePosts>>;
export type SinglePostType = QueryData<ReturnType<typeof getSinglePost>>;
export type SearchPostType = QueryData<ReturnType<typeof searchPosts>>;