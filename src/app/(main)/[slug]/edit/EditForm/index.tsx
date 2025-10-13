'use client'

import { useForm } from 'react-hook-form';
import { Tables } from '../../../../../../utils/supabase/database.types';
import { useMutation } from '@tanstack/react-query';
import { EditPost } from '../../../../../../actions/edit-post';
import { postSchema } from '../../../../../../actions/schemas';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import ErrorMessage from "@/app/components/ErrorMessage";
import ImageUpload from "@/app/components/ImageUpload";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const EditForm = ({postId, initialValues}: {postId: number, initialValues: Pick<Tables<'posts'>, 'title' | 'content' | 'images'>}) => {

    const postWithImageSchema = postSchema.omit( {images:true}).extend({images: z.unknown().transform(value => { return value as FileList}).optional()})
    const router = useRouter();

    const {register, handleSubmit, formState: { errors }, reset, setValue} = useForm({
        resolver: zodResolver(postWithImageSchema),
        defaultValues: {
            title: initialValues.title,
            content: initialValues.content || undefined,
            images: initialValues.images
        }
    });

    const {mutate, isPending} = useMutation({
        mutationFn: EditPost,
        onMutate: () => {
            toast.loading("Updating post...", { id: "edit-post" });
        },
        onSuccess: (result) => {
            if (result.success) {
                toast.success("Post updated successfully!", { id: "edit-post" });
                router.push(`/${result.slug}`);
            } else {
                toast.error(`Failed to update post: ${result.error}`, { id: "edit-post" });
            }
        },
        onError: (error) => {
            toast.error(`Failed to update post: ${error.message}`, { id: "edit-post" });
        }
    });

    return (
        <form onSubmit={handleSubmit(values => {
            console.log("Form values:", values);
            
            let imageForm = new FormData();
            if (values.images?.length && typeof values.images !== 'string') {
                console.log("Adding image to form:", values.images[0]);
                imageForm.append('images', values.images[0]);
            } else {
                console.log("No new image selected");
            }

            console.log("Submitting with imageForm entries:", Array.from(imageForm.entries()));
            
            mutate({
                postId, 
                userdata: {
                    title: values.title, 
                    content: values.content, 
                    images: imageForm
                }
            });
        })}
        className="border-1 rounded-xl p-4 flex flex-col w-auto mx-auto">
            <h2 className="my-2 text-xl">Edit post</h2>
            
            <fieldset>
                <label htmlFor="title">Post title</label>
                <input 
                    type="text" 
                    {...register('title')} 
                    id="title" 
                    placeholder="Post Title" 
                    className="border-1 rounded-md p-2 w-full"
                />
                {errors.title && <ErrorMessage message={errors.title.message!} />}
            </fieldset>

            <fieldset>
                <label htmlFor="content">Post content</label>
                <textarea 
                    {...register('content')} 
                    id="content" 
                    placeholder="What do you want to write about?" 
                    className="border-1 rounded-md p-2 w-full"
                />
                {errors.content && <ErrorMessage message={errors.content.message!} />}
            </fieldset>

            {initialValues.images && (
                <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Current image:</p>
                    <img 
                        src={initialValues.images} 
                        alt="Current post image" 
                        className="max-h-48 max-w-full rounded-lg shadow-md"
                    />
                </div>
            )}
            
            <ImageUpload
                onImageSelect={(files) => setValue("images", files)}
                error={errors.images?.message}
                label="Update post image (Optional)"
            />
            
            <button 
                type="submit" 
                disabled={isPending}
                className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-4 text-center my-6 w-1/2 hover:cursor-pointer self-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isPending ? "Updating..." : "Update Post"}
            </button>
        </form>
    )
}

export default EditForm;