import AccountProfile from "@/components/shared/AccountProfile";
import { currentUser } from "@clerk/nextjs/server";

const OnboardingPage = async () => {
  const user = await currentUser();
  
  const userValues = {};

  const userData = {
    id: user?.id,
    objectId: userValues?._id,
    username: userValues?.username || user?.username,
    name: userValues?.name || user?.fullName,
    bio: userValues?.bio || "",
    //onboarded: userValues?.onboarded || false,
    image: userValues?.image || user?.imageUrl,
  };
  return (
    <div className="bg-neutral-950 mx-auto py-10 px-6 flex flex-col text-white h-screen">
      <div className="w-[80%] mx-auto">
        <h1 className="text-2xl font-bold mb-2">Onboarding Page</h1>
        <p>
          Welcome to the onboarding process! Please follow the steps to complete
          your setup.
        </p>
        <AccountProfile user={userData} btnTitle="continue" />
      </div>
    </div>
  );
};

export default OnboardingPage;
