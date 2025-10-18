"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { postSchema } from "../../../../actions/schemas";
import { useMutation } from "@tanstack/react-query";
import { CreatePost } from "@/../actions/create-post";
import z from "zod";
import ErrorMessage from "@/app/components/ErrorMessage";
import ImageUpload from "@/app/components/ImageUpload";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";

const CreatePage = () => {
  const postWithImageSchema = postSchema.omit({ images: true }).extend({
    images: z
      .unknown()
      .transform((value) => {
        return value as FileList;
      })
      .optional(),
  });

  const router = useRouter();
  const [resetImageUpload, setResetImageUpload] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: zodResolver(postWithImageSchema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: CreatePost,
    onMutate: () => {
      toast.loading("Creating post...", { id: "create-post" });
    },
    onSuccess: (result) => {
      if (result.success) {
        toast.success("Post created successfully!", { id: "create-post" });
        reset();
        setResetImageUpload(true);
        setTimeout(() => setResetImageUpload(false), 100);
        router.push(`/${result.slug}`);
      } else {
        toast.error(`Failed to create post: ${result.error}`, {
          id: "create-post",
        });
      }
    },
    onError: (error) => {
      toast.error(`Failed to create post: ${error.message}`, {
        id: "create-post",
      });
    },
  });

  return (
    <div className="w-full justify-center flex p-4">
      <form
        onSubmit={handleSubmit((values) => {
          let imageForm = new FormData();
          if (values.images?.length) {
            
            for (let i = 0; i < values.images.length; i++) {
              imageForm.append("images", values.images[i]);
            }
          }
          mutate({
            title: values.title,
            content: values.content,
            images: imageForm,
          });
        })}
        className="border-1 rounded-xl p-4 flex flex-col w-auto mx-auto"
      >
        <h2 className="my-2 text-xl">Make a post</h2>
        <fieldset>
          <label htmlFor="title">Post title</label>
          <input
            type="text"
            {...register("title")}
            id="title"
            placeholder="Post Title"
            className="border-1 rounded-md p-2 w-full"
          />
          {errors.title && <ErrorMessage message={errors.title.message!} />}
        </fieldset>

        <fieldset>
          <label htmlFor="content">Post content</label>
          <textarea
            {...register("content")}
            id="content"
            placeholder="What do you want to write about?"
            className="border-1 rounded-md p-2 w-full"
          />
          {errors.content && <ErrorMessage message={errors.content.message!} />}
        </fieldset>

        <ImageUpload
          onImageSelect={(files) => setValue("images", files)}
          error={errors.images?.message}
          label="Post images (Optional)"
          resetTrigger={resetImageUpload}
          multiple={true}
          maxFiles={5}
        />
        <button
          type="submit"
          disabled={isPending}
          className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl
                    focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 
                    font-medium rounded-lg text-sm px-5 py-4 text-center my-6 w-1/2 self-center 
                    disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "Creating..." : "Create Post"}
        </button>
      </form>
    </div>
  );
};

export default CreatePage;
