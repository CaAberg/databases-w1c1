'use client'

import { useForm } from 'react-hook-form';
import { Tables } from '../../../../../../utils/supabase/database.types';
import { useMutation } from '@tanstack/react-query';
import { EditPost } from '../../../../../../actions/edit-post';
import { postSchema } from '../../../../../../actions/schemas';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const EditForm = ({postId, initialValues}: {postId: number, initialValues: Pick<Tables<'posts'>, 'title' | 'content' | 'images'>}) => {

    const postWithImageSchema = postSchema.omit( {images:true}).extend({images: z.unknown().transform(value => { return value as FileList}).optional()})

    const {register, handleSubmit} = useForm({
        resolver: zodResolver(postWithImageSchema),
        defaultValues: {
            title: initialValues.title,
            content: initialValues.content || undefined,
            images: initialValues.images
        }
    });

    const {mutate, error} = useMutation({
        mutationFn: EditPost
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
        className=" border-1 rounded-xl p-4 flex flex-col w-3xl mx-auto">
            <fieldset>
                <label htmlFor="title">Post title</label>
                <input type="text" {...register('title')} id="title" placeholder="Post Title" className="border-1 rounded-md p-2 w-full"/>
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
                <button type="submit" className="bg-blue-500 text-white rounded-md px-4 py-2 mt-4">Update Post</button>
                {error && <p className="text-red-500 mt-2">Error updating post: {error.message}</p>}
            </fieldset>
        </form>
    )
}

export default EditForm;