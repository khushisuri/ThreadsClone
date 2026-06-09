import Image from "next/image";
import Link from "next/link";

interface props {
  user: {
    _id: string;
    id:string;
    name: string;
    username: string;
    image: string;
  };
}
const UserCard = ({ user }: props) => {
  return (
    <div className="flex gap-4 items-center mt-5">
      <div className="rounded-full overflow-hidden h-13 w-15">
        <Image src={user.image} alt={user.name} width={42} height={60} className="object-cover h-full w-full" />
      </div>
      <div className="flex flex-col w-[-webkit-fill-available]">
        <h2 className="font-bold">{user.name}</h2>
        <p className="text-neutral-400">@{user.username}</p>
      </div>
      <Link
        href={`/profile/${user.id}`}
        className="text-sm text-white bg-violet-600 px-4 py-2 rounded-lg mt-2 cursor-pointer"
      >
        View
      </Link>
    </div>
  );
};

export default UserCard;
