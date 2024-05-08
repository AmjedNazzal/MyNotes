import mongoose, { Schema } from "mongoose";

mongoose.connect(process.env.MONGODB_URI);
mongoose.Promise = global.Promise;

const notesSchema = new Schema(
  {
    title: String,
    description: String,
    author: { type: Schema.Types.ObjectId, ref: "users" },
  },
  {
    timestamps: true,
  }
);

const notes = mongoose.models.notes || mongoose.model("notes", notesSchema);

const usersSchema = new Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isNewFirstLogin: Boolean,
  notes: [{ type: Schema.Types.ObjectId, ref: "notes" }],
  pwdrectkn: String,
});

const users = mongoose.models.users || mongoose.model("users", usersSchema);

export { notes, users };
