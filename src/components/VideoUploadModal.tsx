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
  title: string;
  caption: string;
  videoUpload?: File;
}
const VideoUploadModal = ({ open, onOpenChange }: VideoUploadModalProps) => {
  const [selectedVideo, setSelectedVideo] = useState<File>();
  const [formData, setFormData] = useState<FormData>({
    title: "",
    caption: "",
  });
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
          className="flex flex-col space-y-4"
        >
          <div className="space-y-2">
            <label
              htmlFor="title"
              className="text-sm font-medium text-gray-700"
            >
              Title
            </label>

            <input
              id="title"
              name="title"
              placeholder="Add a title (optional)"
              className="w-full p-1.5 px-4 border rounded-md text-gray-700 placeholder:text-gray-400 hover:border-gray-400 focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-200 duration-200 transition-all"
              onChange={handleChange}
              value={formData.title}
            />
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="video-upload"
              className="text-sm font-medium text-gray-700 mb-1"
            >
              Video Upload
            </label>
            <label
              htmlFor="video-upload"
              className="w-full p-1.5 px-4 border rounded-md text-gray-500 cursor-pointer hover:text-stone-700 hover:border-stone-300 duration-200 transition-all"
            >
              <FontAwesomeIcon icon={faFileVideo} />
              {selectedVideo ? selectedVideo.name : " Choose from file"}
            </label>

            <input
              type="file"
              id="video-upload"
              name="videoUpload"
              accept="video/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="caption"
              className="text-sm font-medium text-gray-700"
            >
              Caption
            </label>
            <textarea
              id="caption"
              name="caption"
              placeholder="Add a caption to your video (optional)"
              className="w-full p-1.5 px-4 border rounded-md text-gray-700 placeholder:text-gray-400 hover:border-gray-400 focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-200 duration-200 transition-all h-24 resize-none"
              onChange={handleChange}
              value={formData.caption}
            />
            <p className="text-xs text-gray-500">
              {formData.caption.length} characters
            </p>
          </div>
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
