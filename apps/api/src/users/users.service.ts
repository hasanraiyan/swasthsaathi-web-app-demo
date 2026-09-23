import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async findByClerkId(clerkId: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ clerkId }).exec();
  }

  async syncClerkUser(data: {
    clerkId: string;
    email: string;
    name: string;
    avatarUrl?: string;
  }): Promise<UserDocument> {
    return this.userModel.findOneAndUpdate(
      { clerkId: data.clerkId },
      {
        $set: {
          email: data.email,
          name: data.name,
          avatarUrl: data.avatarUrl,
        },
        $setOnInsert: {
          role: 'patient',
        },
      },
      { upsert: true, new: true },
    );
  }

  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find().exec();
  }
}
