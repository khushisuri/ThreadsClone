"use client";
import { Show, SignOutButton, UserButton } from "@clerk/nextjs";
import { OrganizationSwitcher } from "@clerk/nextjs";
import Image from "next/image";
import { dark } from "@clerk/themes";
const Topbar = () => {
  return (
    <div className="flex fixed top-0 right-0 w-full items-center justify-between bg-neutral-900 h-16 px-4">
      <div className="flex items-center p-2">
        <Image
          src="/logo.svg"
          height={24}
          width={24}
          className=""
          alt="Threads logo"
        ></Image>
        <p className="text-white ml-2 font-bold max-md:hidden">Threads</p>
      </div>
      <div className="flex items-center gap-4">
        <div className="md:hidden">
          <Show when="signed-in">
            <SignOutButton redirectUrl="/sign-in">
              <div className="flex items-center justify-start max-md:justify-center gap-4 p-4 max-md:p-2 rounded-lg hover:bg-neutral-600 cursor-pointer">
                <Image
                  src="/assets/logout.svg"
                  alt="Logout"
                  width={20}
                  height={20}
                  className="max-w-none! cursor-pointer"
                />
              </div>
            </SignOutButton>
          </Show>
        </div>
        <UserButton
          afterSwitchSessionUrl="/onboarding"
          appearance={{ theme: dark }}
        />
        <OrganizationSwitcher
        />
      </div>
    </div>
  );
};

export default Topbar;
