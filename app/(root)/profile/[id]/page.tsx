import { currentUser } from "@clerk/nextjs/server";
import { fetchThread } from "@/lib/actions/thread.action";
import { fetchUser } from "@/lib/actions/user.action";
import ThreadCard from "@/components/shared/ThreadCard";
import CommentForm from "@/components/shared/CommentForm";
import { redirect } from "next/navigation";
import UserHeader from "@/components/shared/UserHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import ThreadsTab from "@/components/shared/ThreadsTab";
const page = async ({ params }: { params: { id: string } }) => {
  const user = await currentUser();

  if (!user) {
    return null;
  }
  const { id } = await params;
  const userValues = await fetchUser(id);

  if (!userValues?.onboarded) {
    redirect("/onboarding");
  }

  return (
    <div>
      <UserHeader user={userValues} />
      <Tabs defaultValue="account" className="w-[400px] w-full">
        <TabsList className="bg-neutral-900 w-full">
          <TabsTrigger value="threads">
            <Image
              src="/assets/edit.svg"
              alt="Threads"
              width={20}
              height={20}
              className="text-primary"
            />
          </TabsTrigger>
          <TabsTrigger value="user">
            <Image
              src="/assets/user.svg"
              alt="User"
              width={20}
              height={20}
              className="text-primary"
            />
          </TabsTrigger>
          <TabsTrigger value="community">
            <Image
              src="/assets/community.svg"
              alt="Community"
              width={20}
              height={20}
              className="text-primary"
            />
          </TabsTrigger>
        </TabsList>
        <TabsContent value="threads">
          <ThreadsTab
            accountId={userValues._id.toString()}
            currentUserId={user.id}
          ></ThreadsTab>
        </TabsContent>
        <TabsContent value="user">Change your password here.</TabsContent>

        <TabsContent value="community">Change your password here.</TabsContent>
      </Tabs>
    </div>
  );
};

export default page;
