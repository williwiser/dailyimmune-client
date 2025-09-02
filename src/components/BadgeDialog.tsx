import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { faAward } from "@fortawesome/free-solid-svg-icons";

interface Notification {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  type: string;
  userId: string;
  createdAt: Date;
}

interface BadgeDialogProps {
  open: boolean;
  onOpenChange: (state: boolean) => void;
  badgeNotification: Notification | null;
}

const BadgeDialog = ({
  open,
  onOpenChange,
  badgeNotification,
}: BadgeDialogProps) => {
  if (!badgeNotification) return null;
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="flex flex-col justify-center item-center text-center">
        <AlertDialogTitle className="flex flex-col items-center">
          <div className="flex items-center justify-center bg-amber-500 p-4 rounded-full size-28 border border-stone-300 mb-6">
            <FontAwesomeIcon icon={faAward} className="text-5xl" />
          </div>
          <p className="bg-gray-200 py-2 px-4 rounded-md">
            {badgeNotification.title}
          </p>
        </AlertDialogTitle>
        <AlertDialogDescription className="max-w-lg">
          <p className="mb-4">
            <span className="font-semibold">Congratulations!</span>{" "}
            {badgeNotification.message}
          </p>
          <div className="px-4 py-6 bg-stone-300/50 rounded-md border border-stone-300">
            <p className="font-semibold mb-2">Revelation 12:11 (NIV)</p>
            <span className="text-balance">
              "They triumphed over him by the blood of the Lamb and by the word
              of their testimony; they did not love their lives so much as to
              shrink from death."
            </span>
          </div>
        </AlertDialogDescription>
        <AlertDialogFooter className="flex justify-center">
          <AlertDialogAction className="mx-auto">Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default BadgeDialog;
