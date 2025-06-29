import { DialogHeader } from "@/components/ui/dialog";
import Container from "@/layouts/Container";
import Section from "@/layouts/Section";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import axios from "axios";
import "draft-js/dist/Draft.css";
import {
  Check,
  Circle,
  FullscreenIcon,
  Image,
  ImagePlus,
  Save,
} from "lucide-react";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useLocation, useParams } from "react-router";
import PulseLoader from "react-spinners/PulseLoader";
import { toast, Toaster } from "sonner";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

interface Testimony {
  id: string;
  title: string;
  thumbnail: File | null;
  body: string;
}

const statusStates = [
  { text: "Saved", icon: <Check className="text-green-500" /> },
  { text: "Unsaved", icon: <Circle className="text-amber-500" /> },
];

const ArticleEditor = () => {
  const params = useParams();
  const { id } = params;
  const location = useLocation();
  const match = location.pathname.endsWith("/edit");
  const navigate = useNavigate();
  const [showDialog, setShowDialog] = useState(false);
  const isEditMode = match;
  const [isSaving, setIsSaving] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [testimony, setTestimony] = useState<Testimony>({
    id: "",
    title: "",
    body: "",
    thumbnail: null,
  });
  const [gotError, setGotError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping] = useState(false);
  const [formData, setFormData] = useState<{
    title: string;
    thumbnail: File | null;
    body: string;
    status: string;
    action: string;
  }>({
    title: "",
    thumbnail: null,
    body: "",
    status: "draft",
    action: "",
  });
  const [status, setStatus] = useState(
    isEditMode ? statusStates[0] : statusStates[1]
  );

  useEffect(() => {
    if (isEditMode) {
      axios
        .get(`${BACKEND_URL}/api/v1/testimonies/${id}`, {
          withCredentials: true,
        })
        .then((response) => {
          setTestimony({
            id: response.data.id,
            title: response.data.title,
            thumbnail: response.data.thumbnail,
            body: response.data.body,
          });

          setFormData({
            title: response.data.title,
            thumbnail: response.data.thumbnail,
            body: response.data.body,
            status: "pending",
            action: "",
          });
        });
    }
  }, [id, isEditMode]);

  interface FileChangeEvent extends ChangeEvent<HTMLInputElement> {
    target: HTMLInputElement & { files: FileList };
  }

  const handleFileChange = (e: FileChangeEvent) => {
    setImage(e.target.files[0]);
    setFormData({ ...formData, thumbnail: e.target.files[0] });
  };

  const submitNewArticle = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const action = (
      (e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null
    )?.name;
    console.log("action " + action);
    if (action === "save") {
      setIsSaving(true);
      setFormData({ ...formData, status: "draft" });
    } else if (action === "publish") {
      setIsLoading(true);
      setFormData({ ...formData, status: "published" });
    }
    // Step 1: Get signed URL from backend

    console.log(formData);

    axios
      .post(`${BACKEND_URL}/api/v1/testimonies`, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        setStatus(statusStates[0]);
        if (action === "save")
          toast.success("Your article has been saved to drafts!");
        else if (action === "publish") {
          setShowDialog(true);
        }
        setGotError(false);
      })
      .catch((error) => {
        setGotError(true);
        console.error(error);
      })
      .finally(() => {
        setIsSaving(false);
        setIsLoading(false);
      });
  };

  const updateArticle = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const action = (
      (e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null
    )?.name;
    console.log("action " + action);
    if (action === "save") {
      setIsSaving(true);
      setFormData({ ...formData, status: "draft" });
    } else if (action === "publish") {
      setIsLoading(true);
      setFormData({ ...formData, status: "published" });
    }
    // Step 1: Get signed URL from backend

    console.log(formData);
    setIsLoading(true);
    axios
      .patch(`${BACKEND_URL}/api/v1/testimonies/${testimony.id}`, formData, {
        withCredentials: true,
      })
      .then(() => {
        if (action === "save") {
          toast.success("Your article has been saved to drafts!");
        } else if (action === "publish") {
          setShowDialog(true);
        }
      })
      .catch((error) => {
        setGotError(true);
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setStatus(statusStates[1]);
  };

  console.log(formData);
  return (
    <div>
      <Toaster />
      <form
        onSubmit={isEditMode ? updateArticle : submitNewArticle}
        encType="multipart/form-data"
      >
        <div className="border-b text-lg bg-gray-50">
          <Container>
            <div className="flex justify-between items-center">
              <div className="flex gap-2 items-center">
                <Link
                  to="/dashboard"
                  className="inline-flex justify-center items-center border rounded-sm size-8"
                >
                  <FontAwesomeIcon icon={faArrowLeft} />
                </Link>
                <h1 className="font-bold">Draft article</h1>
              </div>
              <div className="flex gap-4 items-center">
                {isTyping ? (
                  <PulseLoader color="#6a7282" />
                ) : (
                  <div className="flex items-center gap-1">
                    <span className="text-xs">{status.icon}</span>
                    <span className="text-gray-500">{status.text}</span>
                  </div>
                )}
                <button
                  type="submit"
                  className="inline-flex justify-center items-center px-3 py-1 rounded-md bg-gray-200 text-gray-500  cursor-pointer hover:bg-gray-100 transition-all duration-300"
                  name="save"
                  value="save"
                >
                  {isSaving ? (
                    <span className="w-fit">
                      <PulseLoader color="white" />
                    </span>
                  ) : (
                    <div className="inline-flex items-center justify-center gap-1">
                      <Save />
                      <span>Save</span>
                    </div>
                  )}
                </button>

                <button
                  className="inline-flex justify-center items-center px-3 py-1 rounded-md bg-green-500 text-white cursor-pointer hover:bg-green-400 transition-all duration-300"
                  name="publish"
                  value="publish"
                >
                  {isLoading ? (
                    <span className="w-fit">
                      <PulseLoader color="white" />
                    </span>
                  ) : (
                    "Publish"
                  )}
                </button>
                <button>
                  <FullscreenIcon />
                </button>
              </div>
            </div>
          </Container>
        </div>
        <Section>
          <div className="flex flex-col gap-4">
            {gotError ? (
              <p className="text-red-500">
                Something went wrong, try publishing some other time.
              </p>
            ) : null}
            <input
              placeholder="Add title"
              className="text-5xl playfair-display-600 w-full text-gray-500"
              name="title"
              value={formData.title}
              onChange={handleChange}
            />
            <div className="flex gap-2">
              <label
                htmlFor="thumbnail"
                className="flex gap-2 text-sm items-center text-gray-500 cursor-pointer hover:text-stone-800 transition-all duration-300"
              >
                {image ? <Image /> : <ImagePlus />}
                <span className={image ? "text-stone-800" : ""}>
                  {image ? image.name : "Add featured image (1200×630px)"}
                </span>
              </label>
              {image ? (
                <button
                  className="p-1 bg-red-400 rounded-sm text-white text-sm cursor-pointer"
                  onClick={() => {
                    setFormData({ ...formData, thumbnail: null });
                    setImage(null);
                  }}
                >
                  Remove
                </button>
              ) : null}
            </div>
            <input
              id="thumbnail"
              name="thumbnail"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <hr className="my-4" />
            <textarea
              className="min-h-96 resize-none"
              placeholder="Start writing your testimony here."
              value={formData.body}
              onChange={handleChange}
              name="body"
            ></textarea>
          </div>
        </Section>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent className="flex flex-col justify-center items-center [&>button:last-child]:hidden">
            <DialogHeader>
              <DialogTitle className="mb-4 text-center text-4xl playfair-display-600 text-[#747474]">
                You article has been published!
              </DialogTitle>
              <DialogDescription className="flex justify-center text-center w-full">
                <p className="max-w-sm w-full ">
                  Thank you for sharing your story. Your words have the power to
                  inspire, encourage, and point others to God's grace.
                </p>
              </DialogDescription>
            </DialogHeader>
            <button
              onClick={() => navigate("/dashboard")}
              className="inline-flex w-full md:w-fit justify-center items-center bg-[#3B3B1A] text-white px-4 py-2 rounded-md font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Continue
            </button>
          </DialogContent>
        </Dialog>
      </form>
    </div>
  );
};

export default ArticleEditor;
