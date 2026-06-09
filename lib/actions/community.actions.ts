import { revalidatePath } from "next/cache";
import Community from "../models/commmunity.model";
import { connectToDb } from "../moongoose";

export const createCommunity = async (data: {
  id: string;
  username: string;
  name: string;
  bio: string;
  createdBy: string;
  image: string;
  members: string[];
  pathname: string;
}) => {
  try {
    connectToDb();
    const { username, name, bio, createdBy, image, members, pathname } = data;
    const newCommunity = new Community({
      username,
      name,
      bio,
      createdBy,
      image,
      members,
    });

    await newCommunity.save();
    revalidatePath(pathname);
  } catch (error) {
    throw new Error("Error creating community: " + error);
  }
};

export const fetchCommunities = async () => {
  try {
    connectToDb();
    const communities = await Community.find()
      .populate("createdBy")
      .populate({ path: "members", model: "User" })
      .lean();
    return communities;
  } catch (error) {
    throw new Error("Error fetching communities: " + error);
  }
};
