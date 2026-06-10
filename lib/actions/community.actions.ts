import { revalidatePath } from "next/cache";
import Community from "../models/commmunity.model";
import { connectToDb } from "../moongoose";
import User from "../models/user.model";

export const createCommunity = async (data: {
  id: string;
  name: string;
  createdBy: string;
  image: string;
  members: string[];
  pathname: string;
}) => {
  try {
    await connectToDb();
    const { id, name, createdBy, image, members, pathname } = data;
    const user = await User.findOne({ id: createdBy });
    if (!user) {
      throw new Error("User not found");
    }
    const membersArr = [...members, user._id];
    const newCommunity = new Community({
      id,
      name,
      createdBy: user._id,
      image,
      members: membersArr,
    });

    await newCommunity.save();

    user.communities.push(newCommunity._id);
    await user.save();
    revalidatePath(pathname);
    return newCommunity;
  } catch (error) {
    throw new Error("Error creating community: " + error);
  }
};

export const fetchCommunities = async () => {
  try {
    await connectToDb();
    const communities = await Community.find()
      .populate("createdBy")
      .populate({ path: "members", model: "User" })
      .lean();
    return communities;
  } catch (error) {
    throw new Error("Error fetching communities: " + error);
  }
};
