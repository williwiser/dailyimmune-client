import Header from "@/layouts/Header";
import Section from "@/layouts/Section";
import { useState, type ChangeEvent, type FormEvent } from "react";
import PulseLoader from "react-spinners/PulseLoader";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import axios from "axios";
import { useNavigate } from "react-router";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const SubmitPrayerRequest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [gotError, setGotError] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    subject: "",
    body: "",
    isPublic: true,
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    axios
      .post(`${BACKEND_URL}/api/v1/prayers/`, formData, {
        withCredentials: true,
      })
      .then(() => {
        setShowDialog(true);
      })
      .catch((error) => {
        setGotError(true);
        console.log(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRadioChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      isPublic: value === "public",
    }));
  };
  return (
    <div>
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="flex flex-col justify-center items-center [&>button:last-child]:hidden">
          <DialogHeader>
            <DialogTitle className="mb-4 text-center text-4xl playfair-display-600 text-[#747474]">
              Request submitted successfully!
            </DialogTitle>
            <DialogDescription className="flex justify-center text-center w-full">
              <p className="max-w-sm w-full ">
                Prayer request submitted! Others can now pray with you. You'll
                be notified each time someone does.
              </p>
            </DialogDescription>
          </DialogHeader>
          <button
            onClick={() => navigate("/")}
            className="inline-flex w-full md:w-fit justify-center items-center bg-[#3B3B1A] text-white px-4 py-2 rounded-md font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Continue
          </button>
        </DialogContent>
      </Dialog>
      <Header title="Need Prayer?" desc="We are here for you" />
      <Section className="bg-[url(/vines.png)] bg-size-[20rem] bg-stone-100 bg-bottom-left bg-repeat-y ">
        <div className="flex justify-center">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col justify-center items-center gap-4 w-full max-w-xl bg-white p-6 rounded-md border border-gray-200"
          >
            <h1 className="playfair-display-600 text-4xl text-[#747474] text-center">
              Submit a Prayer Request
            </h1>
            <p className="text-center text-gray-500 text-sm max-w-md my-2">
              We believe in the power of prayer. Share what's on your heart and
              our community will lift you up in faith and love
            </p>
            <input
              name="subject"
              type="text"
              placeholder="Subject"
              onChange={handleChange}
              value={formData.subject}
              className="p-2 border border-stone-400 rounded-md w-full bg-white"
            />

            <textarea
              name="body"
              placeholder="Write your request here..."
              onChange={handleChange}
              value={formData.body}
              className="p-2 border rounded-md w-full border-stone-400 resize-none h-96 bg-white"
            />

            <div className="flex gap-2 items-center w-full">
              <label className="text-gray-500">Visibility: </label>
              <RadioGroup
                defaultValue="public"
                className="w-full"
                onValueChange={handleRadioChange}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="public" id="option-one" />
                  <Label htmlFor="public">Public</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="private" id="option-two" />
                  <Label htmlFor="private">
                    Private (only visible to admins)
                  </Label>
                </div>
              </RadioGroup>
            </div>
            <button
              type="submit"
              className={`inline-flex justify-center items-center px-4 py-2 min-h-[2.6rem] rounded-md border  ${
                isLoading
                  ? "bg-[#858570] border-[#858570]"
                  : "bg-[#3B3B1A] border-[#3B3B1A]"
              } text-white w-full transition-colors duration-200 `}
              disabled={isLoading}
            >
              {isLoading ? <PulseLoader color="#ffffff" /> : "Submit"}
            </button>
            {gotError ? (
              <p className="text-sm text-center text-red-500">
                Something went wrong, please try again later.
              </p>
            ) : (
              ""
            )}
          </form>
        </div>
      </Section>
    </div>
  );
};

export default SubmitPrayerRequest;
