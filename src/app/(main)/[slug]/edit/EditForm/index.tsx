'use client'

import { useForm } from 'react-hook-form';
import { Tables } from '../../../../../../utils/supabase/database.types';
import { useMutation } from '@tanstack/react-query';
import { EditPost } from '../../../../../../actions/edit-post';
import { postSchema } from '../../../../../../actions/schemas';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import ErrorMessage from '@/app/components/ErrorMessage';

const EditForm = ({postId, initialValues}: {postId: number, initialValues: Pick<Tables<'posts'>, 'title' | 'content' | 'images'>}) => {

    const router = useRouter();
    const postWithImageSchema = postSchema.omit( {images:true}).extend({images: z.unknown().transform(value => { return value as FileList}).optional()})

    const {register, handleSubmit, formState: { errors }} = useForm({
        resolver: zodResolver(postWithImageSchema),
        defaultValues: {
            title: initialValues.title,
            content: initialValues.content || undefined,
            images: initialValues.images
        }
    });

    const {mutate, error, isPending} = useMutation({
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
            let imageForm = undefined;
            if (values.images?.length && typeof values.images !== 'string') {
                imageForm = new FormData();
                imageForm.append('images', values.images[0]);
            }

            mutate({postId, userdata:{title: values.title, content: values.content, images: imageForm}});
        }
        )}
        className=" border-1 rounded-xl p-4 flex flex-col mx-auto max-w-2xl w-full">
            <fieldset>
                <label htmlFor="title">Post title</label>
                <input type="text" {...register('title')} id="title" placeholder="Post Title" className="border-1 rounded-md p-2 w-full"/>
                {errors.title && <ErrorMessage message={errors.title.message!} />}
            </fieldset>
            <fieldset>
                <label htmlFor="content">Post content</label>
                <textarea {...register('content')} id="content" placeholder="What do you want to write about?" className="border-1 rounded-md p-2 w-full"/>
            </fieldset>
            <fieldset>
                {initialValues.images && <img src={initialValues.images} alt="Current post image" className="my-4 h-auto w-lg"/>}
                <label htmlFor="images">Post new image</label>
                <input type="file" {...register('images')} id="images" className="border-1 rounded-md p-2 w-full"/>
            </fieldset>

            <fieldset>
                <button 
                    type="submit" 
                    disabled={isPending}
                    className="bg-blue-500 text-white rounded-md px-4 py-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isPending ? "Updating..." : "Update Post"}
                </button>
                {error && <p className="text-red-500 mt-2">Error updating post: {error.message}</p>}
            </fieldset>
        </form>
    )
}

export default EditForm;