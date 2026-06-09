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
import { updateUser } from "@/lib/actions/user.action";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

interface AccountProfileProps {
  user: {
    id: string;
    objectId: string;
    username: string;
    name: string;
    bio: string;
    image: string;
  };
  btnTitle: string;
}

const AccountProfile = ({ user, btnTitle }: AccountProfileProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const [files, setFiles] = useState<File[] | null>(null);
  const { startUpload } = useUploadThing("imageUploader");
  const formSchema = z.object({
    profile_picture: z.string().url().nonempty("Profile picture is required"),
    name: z.string(),
    username: z.string(),
    bio: z.string().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      profile_picture: user.image || "",
      name: user.name || "",
      username: user.username || "",
      bio: user.bio || "",
    },
  });

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (event: string) => void,
  ) => {
    e.preventDefault();
    const file = e.target.files?.[0];
    setFiles(e.target.files ? Array.from(e.target.files) : null);
    if (file) {
      const fileReader = new FileReader();

      fileReader.onload = async () => {
        const imageUrl =
          (fileReader.result && fileReader.result.toString()) || "";
        onChange(imageUrl);
      };

      fileReader.readAsDataURL(file);
    }
  };

  const submitHandler = async (data: z.infer<typeof formSchema>) => {

    if (files) {
      const imgRes = await startUpload(files);
      if (imgRes && imgRes[0].ufsUrl) {
        data.profile_picture = imgRes[0].ufsUrl;
      }
    }
    try {
      await updateUser({
        id: user.id,
        username: data.username,
        name: data.name,
        image: data.profile_picture,
        bio: data.bio || "",
        pathname: pathname,
      });
      if (pathname === "/profile/edit") {
        router.back();
      } else {
        router.push("/");
      }
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
        name="profile_picture"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field
            data-invalid={fieldState.invalid}
            className="flex flex-row items-center justify-start"
          >
            <FieldLabel htmlFor="from-profile_picture" className="w-max!">
              {field.value ? (
                <Image
                  src={field.value}
                  alt="Profile Picture"
                  width={96}
                  height={96}
                  className="rounded-full object-cover h-24 w-24 max-w-none!"
                ></Image>
              ) : (
                <Image
                  src="/assets/profile.svg"
                  alt="Default Profile Picture"
                  width={26}
                  height={26}
                  className="rounded-full object-cover h-6 w-6 max-w-none! overflow-visible"
                ></Image>
              )}
            </FieldLabel>
            <Input
              {...field}
              value={undefined}
              accept="image/*"
              type="file"
              id="form-profile_picture"
              aria-invalid={fieldState.invalid}
              onChange={(e) => handleImageChange(e, field.onChange)}
              className="cursor-pointer bg-neutral-950 border-none"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        name="name"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid} className="flex flex-col">
            <FieldLabel htmlFor="from-name">Name</FieldLabel>
            <Input
              {...field}
              id="form-name"
              aria-invalid={fieldState.invalid}
              autoComplete="name"
              className="bg-neutral-950 border-none"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        name="username"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="from-username">Username</FieldLabel>
            <Input
              {...field}
              id="form-username"
              aria-invalid={fieldState.invalid}
              autoComplete="name"
              className="bg-neutral-950 border-none"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        name="bio"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="form-bio">Bio</FieldLabel>
            <Textarea
              {...field}
              id="form-bio"
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
        {btnTitle}
      </button>
    </form>
  );
};

export default AccountProfile;
