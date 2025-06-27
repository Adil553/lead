/* eslint-disable react-hooks/exhaustive-deps */
import { Settings, X } from "lucide-react"; // or any icon lib
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

type LeadFilterProps = {
  emailWords: string[];
  contactWords: string[];
  nameWords: string[];
  setEmailWords: React.Dispatch<React.SetStateAction<string[]>>;
  setContactWords: React.Dispatch<React.SetStateAction<string[]>>;
  setNameWords: React.Dispatch<React.SetStateAction<string[]>>;
};

const LeadFilter: React.FC<LeadFilterProps> = ({
  emailWords,
  nameWords,
  contactWords,
  setContactWords,
  setEmailWords,
  setNameWords,
}) => {
  const [open, setOpen] = useState(false);

  const [inputs, setInputs] = useState({ email: "", contact: "", name: "" });

  const handleAdd = useCallback(
    (type: "email" | "contact" | "name") => {
      const value = inputs[type].trim();
      if (!value) {
        toast.error(`Please enter a valid ${type} word.`);
        return;
      }
      if (
        (type === "email" && emailWords.includes(value)) ||
        (type === "contact" && contactWords.includes(value)) ||
        (type === "name" && nameWords.includes(value))
      ) {
        toast.error(`"${value}" is already in the ${type} list.`);
        return;
      }
      if (type === "email") setEmailWords((prev) => [...prev, value]);
      if (type === "contact") setContactWords((prev) => [...prev, value]);
      if (type === "name") setNameWords((prev) => [...prev, value]);
      setInputs((prev) => ({ ...prev, [type]: "" }));
      toast.success(`"${value}" added to ${type} filter.`);
    },
    [inputs, emailWords, contactWords, nameWords]
  );

  const handleRemove = useCallback(
    (type: "email" | "contact" | "name", word: string) => {
      if (type === "email")
        setEmailWords((prev) => prev.filter((w) => w !== word));
      if (type === "contact")
        setContactWords((prev) => prev.filter((w) => w !== word));
      if (type === "name")
        setNameWords((prev) => prev.filter((w) => w !== word));
      toast.success(`"${word}" removed from ${type} filter.`);
    },
    []
  );

  return (
    <>
      <Tooltip>
        <TooltipTrigger className="h-6 w-6 text-card-foreground/50 absolute right-0 -top-1">
          <Settings
            className="h-6 w-6 text-card-foreground/50 absolute right-0 -top-1"
            onClick={() => setOpen(true)}
          />
        </TooltipTrigger>
        <TooltipContent>Prohibited Words Filter</TooltipContent>
      </Tooltip>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md rounded-lg p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              Prohibited Words Filter
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {(["email", "contact", "name"] as const).map((type) => (
              <div key={type} className="space-y-3">
                <label className="text-sm font-medium capitalize text-card-foreground">
                  {type} Words
                </label>
                <div className="flex flex-wrap gap-2">
                  {(type === "email"
                    ? emailWords
                    : type === "contact"
                    ? contactWords
                    : nameWords
                  ).map((word) => (
                    <Badge
                      key={word}
                      variant="secondary"
                      className="flex items-center gap-1 bg-card-foreground/90 text-card animate-in fade-in zoom-in-95 duration-200"
                    >
                      {word}
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleRemove(type, word)}
                        className="h-5 w-5 p-0 hover:bg-card/50"
                        aria-label={`Remove ${word} from ${type} filter`}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={inputs[type]}
                    onChange={(e) =>
                      setInputs({ ...inputs, [type]: e.target.value })
                    }
                    placeholder={`Enter ${type} word to filter`}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAdd(type);
                      }
                    }}
                    className="flex-1"
                    aria-label={`Add ${type} word to filter`}
                  />
                  <Button onClick={() => handleAdd(type)}>Add</Button>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
export default LeadFilter;
