"use client"
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import * as z from "zod";
import {postComment} from "@/lib/actions/thread.action";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

const CommentForm = ({
  threadId,
  currentUserImage,
  currentUserId,
}: {
  threadId: string;
  currentUserImage: string;
  currentUserId: string;
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const ThreadSchema = z.object({
    thread: z.string().nonempty("Thread content is required"),
  });

  const form = useForm<z.infer<typeof ThreadSchema>>({
    resolver: zodResolver(ThreadSchema),
    defaultValues: {
      thread: "",
    },
  });

  const submitHandler = async (data: z.infer<typeof ThreadSchema>) => {

    try {
      await postComment({
        text: data.thread,
        currentUserId: currentUserId,
        threadId: threadId,
        pathname: pathname,
      });
      router.push("/");
    } catch (error: unknown) {
      console.log("Error updating user", error);
    }
  };
  return (
    <form
      onSubmit={form.handleSubmit(submitHandler)}
      className="flex flex-col gap-4 p-6 mt-10 bg-neutral-900 rounded-2xl"
    >
      <div className="flex items-center gap-4 p-4 w-full justify-between">
        <div className="rounded-full overflow-hidden">
          <Image
            className="object-cover"
            src={currentUserImage}
            alt="profile-image"
            width={50}
            height={50}
          ></Image>
        </div>
        <Controller
          name="thread"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <input
                {...field}
                type="text"
                placeholder="comment..."
                id="form-thread"
                aria-invalid={fieldState.invalid}
                className="w-[-webkit-fill-available] border-none p-4"
              ></input>

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <button className="rounded-2xl bg-violet-500 text-white text-bold py-2 px-4 cursor-pointer">
          Reply
        </button>
      </div>
    </form>
  );
};

export default CommentForm;
