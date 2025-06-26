import Container from "@/layouts/Container";
import Section from "@/layouts/Section";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import "draft-js/dist/Draft.css";
import { Check, Circle, FullscreenIcon, ImagePlus } from "lucide-react";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useLocation, useParams } from "react-router";
import PulseLoader from "react-spinners/PulseLoader";
import { toast, Toaster } from "sonner";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

interface Testimony {
  id: string;
  title: string;
  thumbnail: string;
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
  const isEditMode = match;
  console.log(isEditMode);
  const [testimony, setTestimony] = useState<Testimony>({
    id: "",
    title: "",
    body: "",
    thumbnail: "",
  });
  const [gotError, setGotError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    thumbnail: "",
    body: "",
    status: "pending",
  });
  const [status] = useState(isEditMode ? statusStates[0] : statusStates[1]);

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
          });
        });
    }
  }, [id, isEditMode]);

  const submitNewArticle = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    axios
      .post(`${BACKEND_URL}/api/v1/testimonies`, formData, {
        withCredentials: true,
      })
      .then(() => {
        toast.success("Your article has been published!");
      })
      .catch((error) => {
        setGotError(true);
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  const updateArticle = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    axios
      .patch(`${BACKEND_URL}/api/v1/testimonies/${testimony.id}`, formData, {
        withCredentials: true,
      })
      .then(() => {
        toast.success("Your article has been updated!");
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
  };

  console.log(formData);
  return (
    <div>
      <Toaster />
      <form onSubmit={isEditMode ? updateArticle : submitNewArticle}>
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
                <div className="flex items-center gap-1">
                  <span className="text-xs">{status.icon}</span>
                  <span className="text-gray-500">{status.text}</span>
                </div>
                <button
                  type="submit"
                  className="inline-flex justify-center items-center px-3 py-1 rounded-md bg-green-500 text-white "
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
            <label
              htmlFor="thumbnail"
              className="flex gap-2 text-sm items-center text-gray-500 cursor-pointer"
            >
              <ImagePlus />
              <span>Add featured image (1200×630px)</span>
            </label>
            <input
              id="thumbnail"
              name="thumbnail"
              type="file"
              className="hidden"
              value={formData.thumbnail}
              onChange={handleChange}
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
      </form>
    </div>
  );
};

export default ArticleEditor;
