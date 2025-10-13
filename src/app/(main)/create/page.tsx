'use client'
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { postSchema } from "../../../../actions/schemas";
import { useMutation } from "@tanstack/react-query";
import { CreatePost } from "@/../actions/create-post"
import z from "zod";
import ErrorMessage from "@/app/components/ErrorMessage";
import { toast } from "sonner";
import { useRouter } from "next/navigation";


const CreatePage = () => {
const postWithImageSchema = postSchema.omit( {images:true}).extend({images: z.unknown().transform(value => { return value as FileList}).optional()})

    const router = useRouter();

    const {register, handleSubmit, formState: { errors }, reset} = useForm({
        resolver:zodResolver(postWithImageSchema)
    })

    const {mutate, error, isPending} = useMutation ({
        mutationFn: CreatePost,
        onMutate: () => {
            
            toast.loading("Creating post...", { id: "create-post" });
        },
        onSuccess: (result) => {
            if (result.success) {
                toast.success("Post created successfully!", { id: "create-post" });
                reset();
                router.push(`/${result.slug}`);
            } else {
                toast.error(`Failed to create post: ${result.error}`, { id: "create-post" });
            }
        },
        onError: (error) => {
            toast.error(`Failed to create post: ${error.message}`, { id: "create-post" });
        }
    })

return (
    <div className="w-full p-4">
    <form onSubmit={handleSubmit(values => {
        let imageForm = new FormData();
        if (values.images?.length) {
            imageForm.append('images', values.images[0]);
        }
        mutate({
            title:values.title,
            content:values.content,
            images: imageForm
        })
        }
)}

     className=" border-1 rounded-xl p-4 flex flex-col w-auto mx-auto">
        <h2>Make a post</h2>
        <fieldset>
            <label htmlFor="title">Post title</label>
            <input type="text" {...register("title")} id="title" placeholder="Post Title" className="border-1 rounded-md p-2 w-full"/>
            {errors.title && <ErrorMessage message={errors.title.message!} />}
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
        <button 
            type="submit" 
            disabled={isPending}
            className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center my-4 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {isPending ? "Creating..." : "Create Post"}
        </button>
    </form>
    
    </div>
  )
}

export default CreatePage;