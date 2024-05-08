"use server";

import { signIn, signOut, auth } from "../../auth";
import { AuthError } from "next-auth";
import { z } from "zod";
import bcrypt from "bcrypt";
import { users, notes } from "@/app/(models)/DB";
import * as nodemailer from "nodemailer";
import { v4 as uuidv4 } from "uuid";
import { Schema } from "mongoose";

interface NewFormData {
  title: string;
  description: string;
}

export async function addNewNote(formData: NewFormData) {
  try {
    const session = await auth();
    const noteData = {
      ...formData,
      author: session?.user.userID,
    };
    const newNote = await notes.create(noteData);
    await users.findByIdAndUpdate(session?.user.userID, {
      $push: { notes: newNote._id },
    });
    return "success";
  } catch (error) {
    throw error;
  }
}

export async function fetchNotes() {
  try {
    const session = await auth();
    const fetchedData = await users
      .findOne({ _id: session?.user.userID })
      .populate({
        path: "notes",
        options: { sort: { updatedAt: 1 } },
      })
      .select("notes isNewFirstLogin -_id");

    const dataCollection = {
      notesData: fetchedData.notes,
      isUserNew: fetchedData.isNewFirstLogin,
    };

    const data = JSON.parse(JSON.stringify(dataCollection));

    if (data) {
      return data;
    }
  } catch (error) {
    throw error;
  }
}

export async function fetchSingleNote(noteID: string) {
  try {
    const session = await auth();
    const note = await notes.findOne({ _id: noteID });
    const data = JSON.parse(JSON.stringify(note));

    if (data) {
      return data;
    }
  } catch (error) {
    throw error;
  }
}

export async function UpdateNote(formData: NewFormData, noteID: string) {
  try {
    await notes.findByIdAndUpdate(noteID, {
      ...formData,
    });

    return "success";
  } catch (error) {
    throw error;
  }
}

export async function DeleteNote(noteID: string) {
  try {
    const session = await auth();
    await notes.findByIdAndDelete(noteID);

    await users.findOneAndUpdate(
      { _id: session?.user.userID },
      { $pull: { notes: noteID } },
      { safe: true, multi: false }
    );

    return "success";
  } catch (error) {
    throw error;
  }
}

export async function MarkTutorialDone() {
  try {
    const session = await auth();
    await users.findByIdAndUpdate(session?.user.userID, {
      isNewFirstLogin: false,
    });

    return "success";
  } catch (error) {
    throw error;
  }
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    await signIn("credentials", formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        default:
          return "Something went wrong.";
      }
    }
    throw error;
  }
}

export async function logOutHandler() {
  try {
    await signOut();
  } catch (error) {
    throw error;
  }
}

interface UserObject {
  email: string;
  password: string;
  isNewFirstLogin: Boolean;
  notes: Schema.Types.ObjectId;
  pwdrectkn: String;
}

export async function signUp(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    const dataToParse = {
      email: "",
      password: "",
      confirmPassword: "",
    };

    const saveValues = async () => {
      dataToParse.email = String(formData.get("email") || "");
      dataToParse.password = String(formData.get("password") || "");
      dataToParse.confirmPassword = String(
        formData.get("confirmPassword") || ""
      );
    };

    await saveValues();

    const parsedCredentials = z
      .object({
        email: z.string(),
        password: z.string().min(8),
        confirmPassword: z.string().min(8),
      })
      .safeParse(dataToParse);

    if (parsedCredentials.success) {
      const { email, password, confirmPassword } = parsedCredentials.data;
      const usersList = await users.find({});
      const isEmailAlreadyExist = usersList.some((userObject: UserObject) => {
        return userObject.email === email;
      });
      if (isEmailAlreadyExist) {
        return "Email already exists!";
      }
      if (password === confirmPassword) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const userData = {
          email: email,
          password: hashedPassword,
          isNewFirstLogin: true,
          pwdrectkn: "",
        };

        const newUser = await users.create(userData);

        const newNote = await notes.create({
          title: "New note",
          description: "Note Content",
          author: `${newUser._id}`,
        });

        newUser.notes.push(newNote._id);
        newUser.save();

        return "Registered successfully";
      } else {
        return "Make sure your password confirmation matches the new password you have set!";
      }
    }
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        default:
          return "Something went wrong.";
      }
    }
    throw error;
  }
}

export async function sendEmailRecovery(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    const email = String(formData.get("email") || "");

    const user = await users.findOne({ email: email });

    if (user) {
      const generatedToken = uuidv4();
      const hashedToken = await bcrypt.hash(generatedToken, 10);
      let tokenInserted;

      const insertToken = async () => {
        try {
          await users.findByIdAndUpdate(user._id, { pwdrectkn: hashedToken });
          tokenInserted = true;
        } catch (error) {
          console.log("failed");
        }
      };

      await insertToken();

      if (tokenInserted) {
        const username = process.env.NEXT_PRIVATE_EMAIL_USERNAME;
        const password = process.env.NEXT_PRIVATE_EMAIL_PASSWORD;
        const constructedLink = `${process.env.BASE_URI}/login/recover/step-two?email=${email}&tkn=${generatedToken}`;
        const transporter = nodemailer.createTransport({
          host: "smtp-mail.outlook.com",
          port: 587,
          tls: {
            ciphers: "SSLv3",
            rejectUnauthorized: false,
          },

          auth: {
            user: username,
            pass: password,
          },
        });

        const res = await transporter.sendMail({
          from: username,
          to: email,
          subject: "Recover your MyNotes account",
          html: `<h1>You have requested to recover your account</h1><p>To change your password, click the link below</p><a href="${constructedLink}" target="_blank">${constructedLink}</a>`,
        });
        if (res) {
          // const data = await res.json()
          console.log(res);
          return `An email has been sent to ${email}`;
        }
      }

      return "Something went wrong, try again later.";
    } else {
      throw new EmailNotFoundError(
        `The email you entered doesn't seem to be in our database!`
      );
    }
  } catch (error) {
    if (error instanceof EmailNotFoundError) {
      // Handle the specific error for missing email here
      return error.message;
    } else {
      // Handle other errors or return a generic message
      return "Something went wrong, try again later.";
    }
  }
}

class EmailNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EmailNotFoundError";
  }
}

export async function resetPassword(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    const passwordsToParse = {
      newPassword: "",
      confirmPassword: "",
    };

    let email;
    let token;
    const saveValues = async () => {
      passwordsToParse.newPassword = String(formData.get("newpassword") || "");
      passwordsToParse.confirmPassword = String(
        formData.get("re-password") || ""
      );
      email = formData.get("email") || "";
      token = formData.get("token") || "";
    };

    await saveValues();

    const userToken = await users
      .findOne({ email: email })
      .select("pwdrectkn -_id");

    if (userToken && token) {
      const tokenMatch = await bcrypt.compare(token, userToken.pwdrectkn);
      if (tokenMatch) {
        const parsedCredentials = z
          .object({
            newPassword: z.string().min(8),
            confirmPassword: z.string().min(8),
          })
          .safeParse(passwordsToParse);

        if (parsedCredentials.success) {
          const { newPassword, confirmPassword } = parsedCredentials.data;

          if (newPassword !== confirmPassword) {
            return "Make sure your password confirmation matches the new password you have set!";
          }

          const hashedPassword = await bcrypt.hash(newPassword, 10);

          await users.findOneAndUpdate(
            { email: email },
            {
              password: hashedPassword,
              pwdrectkn: "",
            }
          );

          return "Password successfully changed!";
        }
      }
    }
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        default:
          return "Something went wrong.";
      }
    }
    throw error;
  }
}
