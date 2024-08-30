import type { FileRouter } from "uploadthing/h3";
import { createUploadthing } from "uploadthing/h3";
import { UTApi } from "uploadthing/server";
import { uploadImage } from "~/utils/abilities";

const { uploadthing } = useRuntimeConfig();

export const utapi = new UTApi({ apiKey: uploadthing.secret });

const f = createUploadthing();

export const uploadRouter = {
  signUpImageUploader: f({ image: { maxFileSize: "1MB" } }).onUploadComplete(
    ({ file }) => {
      console.log("User image upload complete");
      console.log("File url:", file.url);
    },
  ),
  editUserImageUploader: f({ image: { maxFileSize: "1MB" } })
    .middleware(async ({ event }) => {
      await authorize(event, uploadImage);

      const session = await getUserSession(event);
      return { userId: session.user?.id };
    })
    .onUploadComplete(({ metadata, file }) => {
      console.log("User image upload complete for userId:", metadata.userId);
      console.log("File url:", file.url);
    }),
  grantImageUploader: f({ image: { maxFileSize: "1MB" } })
    .middleware(async ({ event }) => {
      await authorize(event, uploadImage);

      const session = await getUserSession(event);
      return { userId: session.user?.id };
    })
    .onUploadComplete(({ metadata, file }) => {
      console.log("Grant image upload complete for userId:", metadata.userId);
      console.log("File url:", file.url);
    }),
} satisfies FileRouter;

export type UploadRouter = typeof uploadRouter;
