import Image from "next/image";

interface props {
  user: {
    name: string;
    username: string;
    image: string;
    bio: string;
  };
}

const UserHeader = ({user}: props) => {
  return (
    <div className="flex flex-col w-full mb-5 gap-4">
      <div className="flex items-center gap-2">
        <div className="rounded-full h-10 w-10 overflow-hidden">
          <Image src={user.image} alt="User" width={40} height={40} />
        </div>
        <div>
          <h2 className={"font-bold text-2xl"}>{user.name}</h2>
          <p className="text-neutral-400">@{user.username}</p>
        </div>
      </div>
      <p>{user.bio}</p>
    </div>
  );
};

export default UserHeader;
