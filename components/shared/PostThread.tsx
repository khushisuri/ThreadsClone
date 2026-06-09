"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import * as z from "zod";
import Image from "next/image";
import { Textarea } from "../ui/textarea";
import { useState } from "react";
import { useUploadThing } from "@/utils/uploadthing";
import {createThread} from "@/lib/actions/thread.action";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
const PostThread = ({ userId }: { userId: string }) => {
  const pathname = usePathname();
  const router = useRouter();
  const ThreadSchema = z.object({
    thread: z.string().nonempty("Thread content is required"),
    accountId: z.string(),
  });

  const form = useForm<z.infer<typeof ThreadSchema>>({
    resolver: zodResolver(ThreadSchema),
    defaultValues: {
      thread: "",
      accountId: userId || "",
    },
  });

  const submitHandler = async (data: z.infer<typeof ThreadSchema>) => {

    try {
         await createThread({
            text:data.thread,
            authorId:userId,
            community:"",
            pathname:pathname
        })
        router.push("/");
    } catch (error: unknown) {
      console.log("Error updating user", error);
    }
  };
  return (
    <form
      onSubmit={form.handleSubmit(submitHandler)}
      className="flex flex-col gap-4 px-6 py-10 mt-10 bg-neutral-900 rounded-2xl"
    >
      <Controller
        name="thread"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="form-thread">Thread</FieldLabel>
            <Textarea
              {...field}
              id="form-thread"
              aria-invalid={fieldState.invalid}
              className="min-h-[120px] bg-neutral-950 border-none"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
       <button
        type="submit"
        className="bg-violet-500 text-white px-4 py-2 rounded-lg hover:bg-violet-600 my-4"
      >
        Post Thread
      </button>
    </form>
  );
};

export default PostThread;
