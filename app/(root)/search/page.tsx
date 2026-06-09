import { currentUser } from "@clerk/nextjs/server";
import { fetchUser, fetchUserBySearch } from "@/lib/actions/user.action";
import { redirect } from "next/navigation";
import UserCard from "@/components/shared/UserCard";

interface user {
  _id: string;
  id:string;
  name: string;
  username: string;
  image: string;
}

const page = async ({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) => {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  const userValues = await fetchUser(user.id);

  if (!userValues?.onboarded) {
    redirect("/onboarding");
  }

  const { q = "" } = await searchParams;
  const users = await fetchUserBySearch(q, user.id);
  return (
    <div className="w-full">
      <h1 className="text-lg">Search</h1>
      {users?.map((user: user) => (
        <UserCard key={user._id} user={user} />
      ))}
    </div>
  );
};

export default page;
