import { DialogFooter, DialogHeader } from "@/components/ui/dialog";
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
  Book,
  Check,
  Circle,
  Image,
  ImagePlus,
  Rocket,
  Save,
} from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { Link, useLocation, useParams } from "react-router";
import PulseLoader from "react-spinners/PulseLoader";
import { toast, Toaster } from "sonner";
import DotLoader from "react-spinners/DotLoader";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

interface Testimony {
  id: string;
  title: string;
  thumbnail: File | null;
  body: string;
  status: string;
}

interface FormData {
  title: string;
  thumbnail: File | null;
  body: string;
  verse?: string;
  reference?: string;
  status: string;
  action: string;
  type: "devotional" | "testimony" | "prayerRequest";
}

const statusStates = [
  { text: "Saved", icon: <Check className="text-green-500" /> },
  { text: "Unsaved", icon: <Circle className="text-amber-500" /> },
];

const truncateText = (text: string, wordLimit: number) => {
  const words = text.split(" ");
  if (words.length <= wordLimit) return text;

  return words.slice(0, wordLimit).join(" ") + "...";
};

const DevotionalEditor = () => {
  const params = useParams();
  const { id } = params;
  const location = useLocation();
  const match = location.pathname.endsWith("/edit");
  const navigate = useNavigate();
  const [showDialog, setShowDialog] = useState(false);
  const [verse, setVerse] = useState<string>();
  const [reference, setReference] = useState<string>();
  const isEditMode = match;
  const [isSaving, setIsSaving] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [devotional, setDevotional] = useState<Testimony>({
    id: "",
    title: "",
    body: "",
    thumbnail: null,
    status: "",
  });
  const [gotError, setGotError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    thumbnail: null,
    body: "",
    verse: undefined,
    reference: undefined,
    status: "draft",
    action: "",
    type: "devotional",
  });
  const [savedStatus, setSavedStatus] = useState(
    isEditMode ? statusStates[0] : statusStates[1]
  );

  useEffect(() => {
    if (isEditMode) {
      axios
        .get(`${BACKEND_URL}/api/v1/posts/${id}`, {
          withCredentials: true,
        })
        .then((response) => {
          setDevotional({
            id: response.data.id,
            title: response.data.title,
            thumbnail: response.data.thumbnail,
            body: response.data.body,
            status: response.data.status,
          });

          setFormData({
            title: response.data.title,
            thumbnail: response.data.thumbnail,
            body: response.data.body,
            status: response.data.status,
            verse: response.data.verse,
            reference: response.data.reference,
            action: "",
            type: "devotional",
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

    // Create FormData object
    // const submitData = new FormData();

    // Set status based on action
    let status = "draft";
    if (action === "save") {
      setIsSaving(true);
      status = "draft";
    } else if (action === "publish") {
      setIsLoading(true);
      status = "published";
    }

    const submitData = {
      title: formData.title,
      body: formData.body,
      type: formData.type,
      status,
      file: formData.thumbnail,
    };

    console.log(submitData);
    axios
      .post(`${BACKEND_URL}/api/v1/posts`, submitData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        setSavedStatus(statusStates[0]);
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
      formData.status = "draft";
    } else if (action === "publish") {
      setIsLoading(true);
      setFormData((prev) => ({ ...prev, status: "published" }));
      formData.status = "published";
    }
    // Step 1: Get signed URL from backend

    const submitData = {
      title: formData.title,
      body: formData.body,
      type: formData.type,
      status: formData.status,
      file: formData.thumbnail,
    };

    axios
      .patch(`${BACKEND_URL}/api/v1/posts/${devotional.id}`, submitData, {
        withCredentials: true,
      })
      .then(() => {
        setSavedStatus(statusStates[0]);
        if (action === "save") {
          toast.success("Your article has been saved to drafts!");
          setIsSaving(false);
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
    setSavedStatus(statusStates[1]);
  };

  return (
    <div>
      <Toaster />
      <form
        onSubmit={isEditMode ? updateArticle : submitNewArticle}
        encType="multipart/form-data"
        ref={formRef}
      >
        <div className="border-b text-lg bg-gray-50">
          <Container>
            <div className="flex justify-between items-center  px-6 2xl:px-0 pt-2">
              <div className="flex gap-2 items-center">
                <Link
                  to="/dashboard"
                  className="inline-flex justify-center items-center border rounded-sm size-8"
                >
                  <FontAwesomeIcon icon={faArrowLeft} />
                </Link>
                <h1 className="font-bold">Draft article (Devotional)</h1>
              </div>
              <div className="hidden md:flex gap-4 items-center">
                {isTyping ? (
                  <PulseLoader color="#6a7282" />
                ) : (
                  <div className="flex items-center gap-1">
                    <span className="text-xs">{savedStatus.icon}</span>
                    <span className="text-gray-500">{savedStatus.text}</span>
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
                  type="submit"
                  name="publish"
                >
                  {isLoading ? (
                    <span className="w-fit">
                      <PulseLoader color="white" />
                    </span>
                  ) : (
                    "Publish"
                  )}
                </button>
              </div>
              <div className="flex gap-4 md:hidden ">
                <button
                  type="submit"
                  name="save"
                  value="save"
                  className="text-gray-500"
                >
                  {isSaving ? <DotLoader size={28} color="grey" /> : <Save />}
                </button>
                {isLoading ? (
                  <DotLoader size={28} color="grey" />
                ) : (
                  <button
                    type="submit"
                    name="publish"
                    className="bg-green-500 p-1.5 rounded-full text-white"
                  >
                    <Rocket />
                  </button>
                )}
              </div>
            </div>
          </Container>
        </div>
        <Section className="p-6">
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
            {verse && reference ? (
              <div className="flex gap-2 text-left text-sm items-center text-gray-500 cursor-pointer hover:text-stone-800 transition-all duration-300 w-fit hover:no-underline p-0">
                <Book />
                <p>
                  {truncateText(verse, 5)}{" "}
                  <span className="font-semibold">{reference}</span>
                </p>

                <button
                  className="p-1 bg-red-400 rounded-sm text-white text-sm cursor-pointer"
                  onClick={() => {
                    setFormData({
                      ...formData,
                      verse: undefined,
                      reference: undefined,
                    });
                    setVerse(undefined);
                    setReference(undefined);
                  }}
                >
                  Remove
                </button>
              </div>
            ) : (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button className="lex  hidden gap-2 text-sm items-center text-gray-500 cursor-pointer hover:text-stone-800 transition-all duration-300 w-fit hover:no-underline p-0">
                    <>
                      <Book />
                      <span>Add featured verse</span>
                    </>
                  </button>
                </AlertDialogTrigger>

                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Add Featured Verse</AlertDialogTitle>
                  </AlertDialogHeader>
                  <div className="flex flex-col gap-2">
                    <textarea
                      name="verse"
                      placeholder="Verse"
                      value={verse}
                      onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                        setVerse(e.target.value)
                      }
                      className="border px-3 py-2 rounded-md w-full h-64 resize-none"
                    />
                    <input
                      name="reference"
                      type="text"
                      value={reference}
                      placeholder="Reference"
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setReference(e.target.value)
                      }
                      className="border px-3 py-2 rounded-md w-full"
                    />
                  </div>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction>Add</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
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
              placeholder="Start writing your devotional here."
              value={formData.body}
              onChange={handleChange}
              name="body"
            ></textarea>
          </div>
        </Section>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent className="flex flex-col justify-center items-center [&>button:last-child]:hidden">
            <DialogHeader>
              <DialogTitle className="text-center text-4xl playfair-display-600 text-[#747474]">
                You article has been published!
              </DialogTitle>
            </DialogHeader>
            <DialogDescription className="flex justify-center text-center w-full max-w-sm">
              Your devotional has been published and is public.
            </DialogDescription>
            <DialogFooter>
              <button
                onClick={() => navigate("/dashboard")}
                className="inline-flex w-full md:w-fit justify-center items-center bg-[#3B3B1A] text-white px-4 py-2 rounded-md font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Continue
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </form>
    </div>
  );
};

export default DevotionalEditor;
