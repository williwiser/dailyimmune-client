import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "./ui/dialog";
import { faFileVideo } from "@fortawesome/free-solid-svg-icons";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { useState, type ChangeEvent, type FormEvent } from "react";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

interface VideoUploadModalProps {
  open: boolean;
  onOpenChange: (state: boolean) => void;
}

interface FormData {
  caption?: string;
  videoUpload?: File;
}
const VideoUploadModal = ({ open, onOpenChange }: VideoUploadModalProps) => {
  const [selectedVideo, setSelectedVideo] = useState<File>();
  const [formData, setFormData] = useState<FormData>({});
  const [isLoading, setIsLoading] = useState(false);
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setSelectedVideo(e.target.files[0]);
  };
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setFormData((prev) => ({ ...prev, videoUpload: selectedVideo }));
    axios
      .post(`${BACKEND_URL}/api/v1/videos`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then(() => {
        alert("Successful!");
        onOpenChange(false);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle>Upload Video</DialogTitle>
        <DialogDescription>Upload a video to your feed</DialogDescription>
        <form
          id="video-form"
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
        >
          <label
            htmlFor="video-upload"
            className="inline-flex items-center gap-2 p-1.5 px-4 border rounded-md text-gray-500 cursor-pointer hover:text-stone-700 hover:border-stone-300 duration-200 transition-all"
          >
            <FontAwesomeIcon icon={faFileVideo} />
            {selectedVideo ? selectedVideo.name : "Choose from file"}
          </label>

          <input
            type="file"
            id="video-upload"
            name="videoUpload"
            accept="video/*"
            className="hidden"
            onChange={handleFileChange}
          />

          <textarea
            id="caption"
            name="caption"
            placeholder="Caption (optional)"
            className="inline-flex items-center gap-2 p-1.5 px-4 border rounded-md text-gray-500 hover:text-stone-700 hover:border-stone-300 duration-200 transition-all h-60 resize-none"
            onChange={handleChange}
          />
        </form>
        <Separator />
        <DialogFooter>
          <Button type="submit" form="video-form" disabled={isLoading}>
            Post
          </Button>
          <DialogClose>
            <Button variant={"ghost"} disabled={isLoading}>
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VideoUploadModal;
