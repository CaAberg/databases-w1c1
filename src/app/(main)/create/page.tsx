'use client'
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { postSchema } from "../../../../actions/schemas";
import { useMutation } from "@tanstack/react-query";
import { CreatePost } from "@/../actions/create-post"
import z from "zod";
import ErrorMessage from "@/app/components/ErrorMessage";


const CreatePage = () => {
const postWithImageSchema = postSchema.omit( {images:true}).extend({images: z.unknown().transform(value => { return value as FileList}).optional()})

    const {register, handleSubmit, formState: { errors }} = useForm({
        resolver:zodResolver(postWithImageSchema)
    })

    const {mutate, error} = useMutation ({
        mutationFn: CreatePost
    })

return (
    <div className="w-full p-4">
    <form onSubmit={handleSubmit(values => {
        let imageForm = new FormData();
        if (values.images?.length) {
            console.log("image file inside submit:", values.images);
            imageForm.append('images', values.images[0]);
        }
        mutate({
            title:values.title,
            content:values.content,
            images: imageForm
        })
        }
)}

     className=" border-1 rounded-xl p-4 flex flex-col w-3xl mx-auto">
        <h2>Make a post</h2>
        <fieldset>
            <label htmlFor="title">Post title</label>
            <input type="text" {...register("title")} id="title" placeholder="Post Title" className="border-1 rounded-md p-2 w-full"/>
        </fieldset>

        <fieldset>
            <label htmlFor="content">Post content</label>
            <textarea {...register("content")} id="content" placeholder="What do you want to write about?" className="border-1 rounded-md p-2 w-full"/>
        </fieldset>

        <fieldset>
            <label htmlFor="images">Post image</label>
            <input type="file" {...register("images")} id="images" className="border-1 rounded-md p-2 w-full" />
            {errors.images && <ErrorMessage message={errors.images.message!} />}
            </fieldset>
        <button type="submit" className="bg-blue-500 text-white rounded-md p-2 mt-4 w-full">Create Post</button>
    </form>
    
    </div>
  )
}

export default CreatePage;