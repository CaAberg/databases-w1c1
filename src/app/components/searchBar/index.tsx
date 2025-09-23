'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { searchPosts } from '@/../utils/supabase/queries';
import type { Tables } from '@/../utils/supabase/database.types';

type Post = Tables<'posts'> & { users?: Tables<'users'> };


const useSearchPosts = (query: string) => {
  return useQuery<Post[], Error>({
    queryKey: ['search', query],
    queryFn: async (): Promise<Post[]> => {
      const { data, error } = await searchPosts(query);
      if (error) throw error;
      return (data ?? []).map((item) => ({
        
        id: item.id,
        title: item.title,
        slug: item.slug,
        users: item.users,
        content: (item as any).content ?? null,
        created_at: (item as any).created_at ?? '',
        user_id: (item as any).user_id ?? '',
      })) as Post[];
    },
    enabled: query.length > 1,
  });
};

export default function SearchBar() {
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const pathname = usePathname();
  const { data: results, isLoading } = useSearchPosts(search);

 
  useEffect(() => {
    setSearchInput('');
    setSearch('');
    setIsOpen(false);
    inputRef.current?.blur();
  }, [pathname]);


  useEffect(() => {
    const handler = setTimeout(() => setSearch(searchInput), 300);
    return () => clearTimeout(handler);
  }, [searchInput]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full max-w-md mx-auto">
      <input
        ref={inputRef}
        type="text"
        value={searchInput}
        onChange={(e) => {
          setSearchInput(e.target.value);
          setIsOpen(true);
        }}
        placeholder="Search posts..."
        className="w-full p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        onFocus={() => setIsOpen(true)}
      />

      {isOpen && search.length > 1 && (
        <div className="absolute z-10 w-full bg-white border border-gray-300 rounded mt-1 max-h-60 overflow-y-auto ">
          {isLoading && <div className="p-4 text-gray-500">Loading...</div>}
          {!isLoading && results?.length === 0 && (
            <div className="p-4 text-gray-500">No results found</div>
          )}
          {!isLoading &&
            results?.map(({ id, slug, title, users }) => (
              <Link
                key={id}
                href={`/${slug}`}
                className="p-4 border-b border-gray-300 shadow-md block rounded-md hover:bg-gray-50"
                onClick={() => setIsOpen(false)} 
              >
                <h2 className="text-xl font-bold text-black">{title}</h2>
                <p className="text-gray-600">by {users?.username}</p>
              </Link>
            ))}
        </div>
      )}
    </div>
  );
}