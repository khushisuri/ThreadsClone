"use server";
import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { connectToDb } from "../moongoose";
import mongoose from "mongoose";
interface props {
  text: string;
  authorId: string;
  community: string;
  pathname: string;
}

export async function createThread({
  text,
  authorId,
  community,
  pathname,
}: props) {
  try {
    await connectToDb();
    const authorObjectId = new mongoose.Types.ObjectId(authorId);
    const createdThread = await Thread.create({
      text,
      author: authorObjectId,
      community: null,
    });
    await User.findByIdAndUpdate(authorId, {
      $push: { threads: createdThread._id },
    });
    revalidatePath(pathname);
  } catch (error) {
    throw new Error("Error" + error);
  }
}

export async function fetchThreads({
  page,
  pageSize,
}: {
  page: number;
  pageSize: number;
}) {
  try {
    await connectToDb();
    const threads = await Thread.find({ parentId: { $in: [null, undefined] } })
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .populate({ path: "author", model: "user" })
      .populate({
        path: "children",
        populate: { path: "author", model: "user" },
      })
      .lean();
    const totalPostsCount = await Thread.countDocuments({
      parentId: { $in: [null, undefined] },
    });
    const isNext = totalPostsCount > (page - 1) * pageSize + threads.length;
    return { threads: JSON.parse(JSON.stringify(threads)), isNext };
  } catch (error) {
    throw new Error("Error fetching threads: " + error);
  }
}

export async function fetchThread(id: string) {
  try {
    await connectToDb();
    const idVal = new mongoose.Types.ObjectId(id);
    const thread = await Thread.findById({ _id: idVal })
      .populate({ path: "author", model: "user" })
      .populate({
        path: "children",
        populate: { path: "author", model: "user" },
      })
      .lean();
    return JSON.parse(JSON.stringify(thread));
  } catch (error) {
    throw new Error("Error fetching thread: " + error);
  }
}

export async function postComment({
  threadId,
  currentUserId,
  text,
  pathname,
}: {
  threadId: string;
  currentUserId: string;
  text: string;
  pathname: string;
}) {
  try {
    await connectToDb();
    const originalThread = await Thread.findById(threadId);

    if (!originalThread) {
      throw "Thread not found";
    }

    const postedThread = await new Thread({
      text: text,
      author: currentUserId,
      parentId: threadId,
    });

    const savedThread = await postedThread.save();
    originalThread.children.push(savedThread._id);

    await originalThread.save();

    revalidatePath(pathname);
  } catch (error) {
    console.log(error);
  }
}

export async function fetchUserPosts(userId: string) {
  try {
    await connectToDb();
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const user = await User.findById(userObjectId).populate({
      path: "threads",
      model: "Thread",
      populate: [
        { path: "author", model: "user" },
        {
          path: "children",
          model: "Thread",
          populate: { path: "author", model: "user" },
        },
      ],
    }).lean();
    return JSON.parse(JSON.stringify(user.threads));
  } catch (error) {
    throw new Error("Error fetching user posts: " + error);
  }
}

