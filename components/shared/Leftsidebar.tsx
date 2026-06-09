"use client";
import Link from "next/link";
import Image from "next/image";
import { sidebarLinks } from "../../constants/list";
import { usePathname, useRouter } from "next/navigation";
import { SignOutButton } from "@clerk/nextjs";
import { Show } from "@clerk/react";
const Leftsidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="w-75 max-md:w-max bg-neutral-900 height-full text-white flex flex-col p-4 justify-between">
      <div className="flex flex-col items-between gap-4">
        {sidebarLinks.map((link) => {
          const isActive =
            pathname === link.route ||
            (pathname.includes(link.route) && link.route)
              ? true
              : false;
          return (
            <Link
              key={link.route}
              href={link.route}
              className={`flex items-center justify-start max-md:justify-center gap-4 p-4 max-md:p-2 rounded-lg hover:bg-neutral-600 ${isActive ? "bg-violet-500" : ""}`}
            >
              <Image
                src={link.imgURL}
                alt={link.label}
                width={20}
                height={20}
                className="max-w-none!"
              />
              <span className="max-md:hidden">{link.label}</span>
            </Link>
          );
        })}
      </div>
      <div className="max-md:hidden">
      <Show when="signed-in">
        <SignOutButton redirectUrl="/sign-in">
          <div
            className="flex items-center justify-start max-md:justify-center gap-4 p-4 max-md:p-2 rounded-lg hover:bg-neutral-600 cursor-pointer"
          >
            <Image
              src="/assets/logout.svg"
              alt="Logout"
              width={20}
              height={20}
              className="max-w-none! cursor-pointer"
            />
            <span>Logout</span>
          </div>
        </SignOutButton>
      </Show>
    </div>
    </div>
  );
};

export default Leftsidebar;
