import { fetchUser, getActivity } from "@/lib/actions/user.action";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import Image from "next/image";
import Link from "next/link";
const page = async () => {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  const userValues = await fetchUser(user?.id);
  if (!userValues?.onboarded) {
    redirect("/onboarding");
  }

  const activity = await getActivity(userValues.id.toString());
  return (
    <div>
      <h1>Activity</h1>
      {activity.map((thread: any) => (
        <Link href={`/thread/${thread._id}`} key={thread._id} className="  flex items-center gap-4 p-4 border-b border-neutral-700">
          <div className="rounded-full overflow-hidden">
            <Image
              src={thread.author.image}
              alt={thread.author.name}
              width={40}
              height={40}
            />
          </div>
          <span className="text-blue-900">{thread.author.name}</span>
          <span>replied to your thread</span>
        </Link>
      ))}
    </div>
  );
};

export default page;
