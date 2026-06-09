"use server";
import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectToDb } from "../moongoose";
import { type FilterQuery } from "mongoose";
import Thread from "../models/thread.model";
interface params {
  id: string;
  username: string;
  name: string;
  image: string;
  bio: string;
  pathname: string;
}

export async function updateUser({
  id,
  username,
  name,
  image,
  bio,
  pathname,
}: params) {
  try {
    await connectToDb();
    await User.findOneAndUpdate(
      { id },
      {
        username,
        name,
        image,
        bio,
        onboarded: true,
      },
      { upsert: true },
    );
    if (pathname === "/profile/edit") {
      revalidatePath(pathname);
    }
  } catch (error) {
    throw new Error("Error updating user: " + error);
  }
}

export async function fetchUser(id: string) {
  try {
    await connectToDb();
    const user = await User.findOne({ id }).lean();
    return user;
  } catch (error) {
    throw new Error("Error fetching user: " + error);
  }
}

export async function fetchUserBySearch(search: string, userId: string) {
  try {
    await connectToDb();
    const query: FilterQuery<typeof User> = {
      id: { $ne: userId },
    };

    if (search) {
      const searchStr = new RegExp(search, "i");
      query.$or = [
        { username: { $regex: searchStr } },
        { name: { $regex: searchStr } },
      ];
    }
    const users = await User.find(query).lean();
    return JSON.parse(JSON.stringify(users));
  } catch (error) {
    throw new Error("Error fetching user: " + error);
  }
}

export async function getActivity(userId: string) {
  try {
    await connectToDb();
    const currentUser = await User.findOne({ id: userId }).lean() as { _id: unknown } | null;
    if (!currentUser) return [];

    const userThreads = await User.find({ id: userId }).populate({
      path: "threads",
      model: "Thread",
    });

    type PopulatedThread = { children: string[] };
    type PopulatedUser = { threads: PopulatedThread[] };
    const childThreadIds = (userThreads as PopulatedUser[]).reduce((acc: string[], userThread) => {
      return acc.concat(
        userThread.threads.reduce((innerAcc: string[], t) => {
          return innerAcc.concat(t.children);
        }, []),
      );
    }, []);

    const childThreads = await Thread.find({
      _id: { $in: childThreadIds },
      author: { $ne: currentUser._id },
    })
      .populate({ path: "author", model: "user" })
      .lean();

    console.log( JSON.parse(JSON.stringify(childThreads)));
    return JSON.parse(JSON.stringify(childThreads));
  } catch (error) {
    throw new Error("Error fetching activity: " + error);
  }
}
