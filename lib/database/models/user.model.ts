import { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
  clerkId: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  photo: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  planId: {
    type: Number,
    default: 1,
  },
  creditBalance: {
    type: Number,
    default: 3,
  },
  jobDescription: {
    type: String, 
  },
  completeResume: {
    type: Number, 
  },
  tailoredResume: [
    {
    skills: { type: String, default: "" },
    workExperience: { type: String, default: "" },
    ProjectExperience: { type: String, default: "" },
  }
  ],
});

const User = models?.User || model("User", UserSchema);

export default User;