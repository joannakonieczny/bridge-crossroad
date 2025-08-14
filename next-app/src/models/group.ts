import type { Document, Types } from 'mongoose';
import mongoose, { Schema } from 'mongoose';

export type IGroup = Document & {
  _id: Types.ObjectId;
  name: string;
  createdAt: Date;
  admin: Types.ObjectId; 
  members: Types.ObjectId[];
  imageUrl?: string;
  invitationCode: string; 
  //openings: string[]; 
  //chat: Types.ObjectId;
  //materials: Types.ObjectId;
}

const Group = new Schema<IGroup>({
  name: { 
    type: String, 
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  admin: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  members: [
    { 
      type: Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    }
  ],
  imageUrl: { 
    type: String, 
    required: false 
  },
  invitationCode: { type: String, required: true, length: 8 },
  //openings: [{ type: String }],
  //chat: { type: Schema.Types.ObjectId, ref: 'Chat', required: false },
  //materials: { type: Schema.Types.ObjectId, ref: 'Dir', required: false }
});

export default mongoose.models.Group || mongoose.model<IGroup>('Group', Group);

