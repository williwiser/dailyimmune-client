import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  faCheckToSlot,
  faClose,
  faHeart,
  faPray,
} from "@fortawesome/free-solid-svg-icons";

interface PrayerModalProps {
  id: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subject?: string;
  prayerAnswered?: boolean;
  author?: string;
  body?: string;
  prayingCount?: number;
  prayingForYou?: boolean;
  edited: Date;
  edit?: boolean;
  onDelete?: (id: string) => void;
  onAnsweredPrayer?: (id: string) => void;
  onPrayingForYou?: (id: string) => void;
}

export const PrayerModal = ({
  id,
  open,
  onOpenChange,
  subject,
  prayerAnswered,
  author,
  body,
  prayingCount,
  edited,
  edit,
  onDelete,
  onAnsweredPrayer,
  onPrayingForYou,
  prayingForYou,
}: PrayerModalProps) => {
  const handleDelete = () => {
    if (onDelete) onDelete(id);
  };
  const handleAnsweredPrayer = () => {
    if (onAnsweredPrayer) onAnsweredPrayer(id);
  };
  const handlePrayingForYou = () => {
    if (onPrayingForYou) onPrayingForYou(id);
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{subject}</DialogTitle>
          <DialogDescription>
            <span
              className={`${
                prayerAnswered
                  ? "bg-lime-400/50 border border-lime-600 text-lime-900"
                  : "bg-amber-400/50 border border-amber-600 text-amber-900"
              } text-xs py-1 px-1.5 rounded-full font-semibold w-fit inline-flex justify-center items-center mb-3 mt-1`}
            >
              {prayerAnswered ? "Answered" : "Still needs prayer"}
            </span>
            <p className="italic">Submitted by {author}</p>
          </DialogDescription>
        </DialogHeader>
        <hr />
        <div>
          <p className="text-gray-500 mb-4">{body}</p>
          <div className="flex justify-between">
            <p className="text-xs">
              <FontAwesomeIcon icon={faHeart} className="text-gray-500" />{" "}
              <span className="text-gray-500">{prayingCount} Praying</span>
            </p>
            <p className="text-xs text-gray-500">
              {new Date(edited).toLocaleDateString()}
            </p>
          </div>
        </div>
        <DialogFooter>
          {edit ? (
            prayerAnswered ? (
              <Button onClick={handleAnsweredPrayer}>
                <FontAwesomeIcon icon={faPray} /> Still need prayer
              </Button>
            ) : (
              <Button onClick={handleAnsweredPrayer}>
                <FontAwesomeIcon icon={faCheckToSlot} /> Answered
              </Button>
            )
          ) : prayingForYou ? (
            <Button onClick={handlePrayingForYou}>
              <FontAwesomeIcon icon={faClose} /> Remove from prayer list
            </Button>
          ) : (
            <Button onClick={handlePrayingForYou}>
              <FontAwesomeIcon icon={faHeart} /> Praying for you
            </Button>
          )}
          {edit ? (
            <Button variant="ghost" onClick={handleDelete}>
              Remove
            </Button>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
