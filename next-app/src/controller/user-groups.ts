"server-only";

import User, { IUserDTO } from "@/models/user";
import dbConnect from "@/util/connect-mongo";
import { findByInviteCode, addUser, getMembers } from "./groups";

export async function joinGroup(userId: string, invitationCode: string) : Promise<IUserDTO | null> {
    await dbConnect();
    const group = await findByInviteCode(invitationCode);
    if (group) {
        await addUser(userId, group._id.toString());
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $push: { groups: group._id } },
            {
                new: true,
                runValidators: true,
            }
        );
        return updatedUser ? updatedUser.toObject() : null;
    }
    return null;
}

export async function getMembersAsUsers(groupId: string) {
    await dbConnect();
    
    const idList = await getMembers(groupId);
    const userList = await User.find({ _id: { $in: idList } });

    return userList;
}