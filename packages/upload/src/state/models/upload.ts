import { createModel } from "@captaincodeman/rdx";
import { State } from "../store";
import { storage } from "../firebase";
import { createSelector } from "reselect";
import { underscore4space } from "../../util/regex";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

export interface UploadState {
  file?: {};
  progress: number;
  message?: string;
}
const storageRef = ref(storage);
export default createModel({
  state: <UploadState>{
    fileName: "",
    progress: 0,
  },
  reducers: {
    upload(state, file: File) {
      const fileName = file && file.name ? file.name : "";
      return { ...state, fileName };
    },
    progress(state, percent: number) {
      return { ...state, progress: percent };
    },
    message(state, message) {
      return { ...state, message };
    },
  },
  effects: (_store) => ({
    async upload(file: File) {
      const name = underscore4space(`${new Date().getTime()}_${file.name}`);
      const mediaUploadedRef = ref(storageRef, `mediaUploaded/${name}`);
      if (file && file.name) {
        const uploadTask = uploadBytesResumable(mediaUploadedRef, file);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            _store.getDispatch().upload.progress(progress * 100);
            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
            }
          },
          (error) => {
            console.log("woopsies, something bad happened with the upload", error);
          },
          () => {
            // Handle successful uploads on complete

            var time = new Date().toLocaleTimeString("en-US");
            _store.getDispatch().upload.progress(100);
            _store
              .getDispatch()
              .upload.message(`The file ${file.name} was uploaded at ${time}.`);
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              console.log("File available at", downloadURL);
            });
          }
        );
        // _store.getDispatch().upload.createRecord(name) What happened to this??? Where did it go?
      }
    },

    init() {
      _store.getDispatch().upload.message("");
    },
  }),
});

const getState = (state: State) => state.upload;
export namespace UploadSelectors {
  export const progress = createSelector([getState], (state) => state.progress);
  export const message = createSelector([getState], (state) => state.message);
}
