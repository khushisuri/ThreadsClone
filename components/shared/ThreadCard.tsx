"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface props {
  id: string;
  currentUserId: string;
  parentId: string | null;
  text: string;
  author: {
    id: string;
    image: string;
    username: string;
  };
  community: {
    id: string;
    name: string;
    image: string;
  };
  createdAt: string;
  comments: {
    author: {
      image: string;
    };
  }[];
  isComment?: boolean;
}

const ThreadCard = ({
  id,
  currentUserId,
  text,
  author,
  community,
  createdAt,
  comments,
  isComment = false,
}: props) => {
  const router = useRouter();

  return (
    <article
      onClick={() => router.push(`/thread/${id}`)}
      className={`cursor-pointer border rounded-md w-full ${isComment ? "bg-neutral-950 p-2" : "bg-neutral-900 p-4"} border-none`}
    >
      <div className="flex items-center gap-6">
        <div className="flex flex-col items-center gap-2 h-full">
          <Link href={`/profile/${author.id}`} onClick={(e) => e.stopPropagation()}>
            <div className="rounded-full overflow-hidden h-10 w-10">
              <Image
                src={author.image}
                alt={"profile picture"}
                className="h-full w-full object-cover"
                height={34}
                width={34}
              ></Image>
            </div>
          </Link>
          <div className="mt-0.5 w-0.5 bg-neutral-600 h-14 rounded-2xl"></div>
        </div>
        <div className="flex flex-col justify-between text-white gap-2 ">
          <h2 className="text-sm font-bold">{author.username}</h2>
          <p>{text}</p>
          <div className="flex items-center gap-4 mt-2">
            <Image
              src="/assets/heart.svg"
              alt={"like icon"}
              height={16}
              width={16}
            ></Image>
            <Image
              src="/assets/reply.svg"
              alt={"comment icon"}
              height={20}
              width={20}
            ></Image>
            <Image
              src="/assets/repost.svg"
              alt={"repost icon"}
              height={20}
              width={20}
            ></Image>
            <Image
              src="/assets/share.svg"
              alt={"share icon"}
              height={20}
              width={20}
            ></Image>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ThreadCard;
