import PostThread from "@/components/shared/PostThread";
import { fetchUser } from "@/lib/actions/user.action";
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation";

const page = async () => {
    const user = await currentUser();

    if(!user){
        return null
    }
    
    const userValues = await fetchUser(user?.id);
    if(!userValues?.onboarded){
        redirect("/onboarding");
    }

    return (
    <div><h1 className="text-lg">Create Thread</h1>
    <PostThread userId={userValues?._id.toString()} />
    </div>
  )
}

export default page