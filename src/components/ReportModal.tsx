import { reportReasons } from "@/data/reportReasons";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";
import type { Comment } from "@/types/Comment";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { Button } from "./ui/button";

interface FormData {
  reason: string;
  description: string;
}

interface ReportModelProps {
  open: boolean;
  onOpenChange: (state: boolean) => void;
  onSubmit: (comment: Comment | null, formData: FormData) => void;
  comment: Comment | null;
}

const ReportModal = ({
  open,
  onOpenChange,
  comment,
  onSubmit,
}: ReportModelProps) => {
  const [formData, setFormData] = useState<FormData>({
    reason: "",
    description: "",
  });
  const handleDescriptionChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleReasonChange = (val: string) => {
    setFormData((prev) => ({ ...prev, reason: val }));
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogTitle>Report a Post or Comment</AlertDialogTitle>
        <AlertDialogDescription>File a report here</AlertDialogDescription>
        <div>
          <form
            id="report-form"
            className="flex flex-col gap-4"
            onSubmit={(e: FormEvent<HTMLFormElement>) => {
              e.preventDefault();
              onSubmit(comment, formData);
            }}
          >
            <Select
              name="reason"
              onValueChange={handleReasonChange}
              value={formData.reason}
              required
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Reason" />
              </SelectTrigger>
              <SelectContent>
                {reportReasons.map((reason, index) => (
                  <SelectItem key={index} value={reason.value}>
                    {reason.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Textarea
              name="description"
              onChange={handleDescriptionChange}
              placeholder="Description"
              value={formData.description}
              required
            />
          </form>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button type="submit" form="report-form">
            Submit
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ReportModal;
