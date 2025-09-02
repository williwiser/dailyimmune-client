import { toast, Toaster } from "sonner";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { useState, type ChangeEvent } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import PulseLoader from "react-spinners/PulseLoader";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

interface EventModalProps {
  open: boolean;
  onOpenChange: (state: boolean) => void;
}

interface FormData {
  title: string;
  description: string;
  additionalNotes: string;
  date: Date;
}
const EventModal = ({ open, onOpenChange }: EventModalProps) => {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    additionalNotes: "",
    date: new Date(),
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    axios
      .post(`${BACKEND_URL}/api/v1/events/new-event`, formData, {
        withCredentials: true,
      })
      .then(() => {
        onOpenChange(false);
        toast.success("Event created successfully!");
      })
      .catch((error) => {
        console.log(error);
        toast.error("Event creation failed");
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

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setFormData((prev) => ({ ...prev, date }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Event</DialogTitle>
          <DialogDescription>Create a new livestream event</DialogDescription>
        </DialogHeader>
        <form
          id="createEvent"
          className="flex flex-col gap-2 w-full"
          onSubmit={handleSubmit}
        >
          <input
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
            className="border px-3 py-2 rounded-md w-full"
          />
          <input
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="border px-3 py-2 rounded-md w-full"
          />
          <textarea
            name="additionalNotes"
            placeholder="Additional Notes"
            value={formData.additionalNotes}
            onChange={handleChange}
            className="border px-3 py-2 rounded-md w-full h-64 resize-none"
          />

          <DatePicker
            name="date"
            className="border px-3 py-2 rounded-md min-w-full"
            showIcon
            showTimeSelect
            dateFormat="Pp"
            selected={formData.date}
            onChange={handleDateChange}
          />
        </form>
        <DialogFooter>
          <Button
            type="submit"
            form="createEvent"
            className="w-[8rem]"
            disabled={isLoading}
          >
            {isLoading ? (
              <PulseLoader color="white" size="12" />
            ) : (
              "Create Event"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
      <Toaster />
    </Dialog>
  );
};

export default EventModal;
