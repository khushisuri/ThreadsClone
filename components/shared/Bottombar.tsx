"use client";
import { sidebarLinks } from "@/constants/list";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
//import { useRouter } from "next/router";

const Bottombar = () => {
    const pathname = usePathname();
    //const router = useRouter();
  return (
    <div className="flex items-center bg-neutral-900 fixed bottom-0 w-full h-16 justify-around md:hidden px-4">
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
              className={`flex items-center gap-4 p-4 max-md:p-2 rounded-lg hover:bg-neutral-600 ${isActive ? "bg-violet-500" : ""}`}
            >
              <Image
                src={link.imgURL}
                alt={link.label}
                width={16}
                height={16}
                className="max-width:0"
              />
              <span className="max-sm:hidden text-white">{link.label.split(" ")[0]}</span>
            </Link>
          );
        })}
      </div>
  )
}

export default Bottombar