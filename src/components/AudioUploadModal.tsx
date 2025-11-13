import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "./ui/dialog";
import {
  faFileAudio,
  faMicrophone,
  faStop,
  faTrash,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import { Separator } from "./ui/separator";
import { ReactMediaRecorder } from "react-media-recorder";
import { Button } from "./ui/button";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

interface AudioUploadModalProps {
  open: boolean;
  onOpenChange: (state: boolean) => void;
  onSubmit?: (data: { file: File | Blob; body: string; title: string }) => void;
}

const AudioUploadModal = ({ open, onOpenChange }: AudioUploadModalProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [body, setBody] = useState("");
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("audio/")) {
        setError("Please select a valid audio file");
        return;
      }
      // Validate file size (e.g., max 50MB)
      if (file.size > 50 * 1024 * 1024) {
        setError("File size must be less than 50MB");
        return;
      }
      setSelectedFile(file);
      setRecordedBlob(null);
      setError("");
    }
  };

  const handleCaptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBody(e.target.value);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleRecordingComplete = (blobUrl: string, blob: Blob) => {
    setRecordedBlob(blob);
    setSelectedFile(null);
    console.log(blobUrl);
    setError("");
  };

  const handleRemoveAudio = () => {
    setSelectedFile(null);
    setRecordedBlob(null);
  };

  const handleSubmit = () => {
    const audioFile = selectedFile || recordedBlob;
    if (!audioFile) {
      setError("Please select or record an audio file");
      return;
    }

    axios.post(
      `${BACKEND_URL}/api/v1/posts`,
      {
        title,
        body,
        type: "audio",
        status: "published",
        file: audioFile,
      },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    handleClose();
  };

  const handleClose = () => {
    setSelectedFile(null);
    setRecordedBlob(null);
    setBody("");
    setError("");
    onOpenChange(false);
  };

  const hasAudio = selectedFile || recordedBlob;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogTitle>Upload Audio</DialogTitle>
        <DialogDescription>
          Upload an audio file or record directly from your microphone
        </DialogDescription>

        <div className="space-y-4">
          {/* Upload/Record Options */}
          <div className="flex flex-wrap gap-3">
            <label
              htmlFor="audio-upload"
              className="inline-flex items-center gap-2 p-1.5 px-4 border rounded-md text-gray-600 cursor-pointer hover:text-gray-900 hover:border-gray-400 hover:bg-gray-50 duration-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FontAwesomeIcon icon={faFileAudio} className="text-sm" />
              <span className="text-sm font-medium">Choose from file</span>
            </label>

            <ReactMediaRecorder
              audio
              onStop={handleRecordingComplete}
              render={({ status, startRecording, stopRecording }) => (
                <div className="flex gap-2">
                  {status === "idle" || status === "stopped" ? (
                    <Button
                      onClick={startRecording}
                      variant="outline"
                      className="gap-2"
                      type="button"
                    >
                      <FontAwesomeIcon
                        icon={faMicrophone}
                        className="text-sm"
                      />
                      {status === "stopped" ? "Record again" : "Record audio"}
                    </Button>
                  ) : status === "recording" ? (
                    <Button
                      onClick={stopRecording}
                      variant="destructive"
                      className="gap-2 animate-pulse"
                      type="button"
                    >
                      <FontAwesomeIcon icon={faStop} className="text-sm" />
                      Stop recording
                    </Button>
                  ) : (
                    <Button variant="outline" disabled className="gap-2">
                      <FontAwesomeIcon
                        icon={faMicrophone}
                        className="text-sm"
                      />
                      Loading...
                    </Button>
                  )}
                </div>
              )}
            />

            <input
              type="file"
              id="audio-upload"
              name="audioUpload"
              accept="audio/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md border border-red-200">
              {error}
            </div>
          )}

          {/* Audio Preview */}
          {hasAudio && (
            <div className="space-y-2 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <FontAwesomeIcon
                    icon={faCheckCircle}
                    className="text-green-600"
                  />
                  <span className="font-medium">
                    {selectedFile ? selectedFile.name : "Recorded audio"}
                  </span>
                </div>
                <Button
                  onClick={handleRemoveAudio}
                  variant="ghost"
                  size="sm"
                  className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                  type="button"
                >
                  <FontAwesomeIcon icon={faTrash} className="text-sm" />
                </Button>
              </div>
              <audio
                src={
                  selectedFile
                    ? URL.createObjectURL(selectedFile)
                    : recordedBlob
                    ? URL.createObjectURL(recordedBlob)
                    : ""
                }
                controls
                className="w-full h-10"
              />
            </div>
          )}

          {/* Caption Input */}
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
              onChange={handleTitleChange}
              value={title}
            />
          </div>

          {/* Caption Input */}
          <div className="space-y-2">
            <label htmlFor="body" className="text-sm font-medium text-gray-700">
              Caption
            </label>
            <textarea
              id="body"
              name="body"
              placeholder="Add a caption to your audio (optional)"
              className="w-full p-1.5 px-4 border rounded-md text-gray-700 placeholder:text-gray-400 hover:border-gray-400 focus:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-200 duration-200 transition-all h-24 resize-none"
              onChange={handleCaptionChange}
              value={body}
            />
            <p className="text-xs text-gray-500">{body.length} characters</p>
          </div>
        </div>

        <Separator />

        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button variant="ghost" type="button">
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={handleSubmit}
            disabled={!hasAudio}
            className="gap-2"
            type="button"
          >
            Post Audio
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AudioUploadModal;
