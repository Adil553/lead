import { useSendWhatsapp } from "@/hooks/useMistralAI";
import { Foodies, Invites } from "@/utils/types";
import clsx from "clsx";
import { BadgePercent, Info, Loader2, Mail, Phone } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

type FoodieProps = {
  foodie: Foodies;
  invitedList: Invites[] | [];
  isResend?: boolean;
};

const isValidPhoneNumber = (phone: string) => {
  // Allow optional "+" at the start, then 10-15 digits
  return /^(\+?\d{10,15})$/.test(phone);
};

const Foodie: React.FC<FoodieProps> = ({
  foodie,
  // invitedList,
  // isResend = false,
}) => {
  const [showContact, setShowContact] = useState(false);
  const [contact, setContact] = useState("");
  const [contactError, setContactError] = useState("");

  const { mutate, isPending } = useSendWhatsapp();
  // const queryClient = useQueryClient();

  // const isPending = false;
  // const isInvited = invitedList?.find((il) => il.recipient === foodie.email);
  // const onInvite = () => {

  //   if (!user) return;
  //   const inviteBody = [
  //     // Include contact invite only if contact exists
  //     ...(foodie.contact
  //       ? [
  //           {
  //             id: 0,
  //             NetworkId: 2,
  //             StoreId: user.storeId,
  //             NotificationTypeId: 1,
  //             Recipient: foodie.contact,
  //             CreatedBy: user.id,
  //             LastUpdatedBy: user.id,
  //             LastUpdatedAt: moment().utc().format(),
  //             CreatedAt: moment().utc().format(),
  //             ExpiryTime: moment().utc().add(2, "days").format(),
  //             Status: 1,
  //             RowVer: 1,
  //             SendFrom: "",
  //             Subject: "",
  //             Body: "",
  //             Title: "",
  //             Description: "",
  //           },
  //         ]
  //       : []),

  //     // Always include email invite
  //     {
  //       id: 0,
  //       NetworkId: 3,
  //       StoreId: user.storeId,
  //       NotificationTypeId: 1,
  //       Recipient: foodie.email,
  //       CreatedBy: user.id,
  //       LastUpdatedBy: user.id,
  //       LastUpdatedAt: moment().utc().format(),
  //       CreatedAt: moment().utc().format(),
  //       ExpiryTime: moment().utc().add(2, "days").format(),
  //       Status: 1,
  //       RowVer: 1,
  //       SendFrom: "",
  //       Subject: "",
  //       Body: "",
  //       Title: "",
  //       Description: "",
  //     },
  //   ];

  //   // console.log(inviteBody);
  //   // console.log(JSON.stringify(inviteBody));
  //   // return;
  //   mutate(inviteBody, {
  //     onSuccess: (res) => {
  //       // console.log({ res });
  //       queryClient.invalidateQueries({
  //         queryKey: [QUERY_KEYS.INVIES, user?.storeId],
  //       });
  //       if (res && res?.status === false) {
  //         toast.error(res?.message ?? "");
  //         return;
  //       }
  //       toast.success(`Successfully invited ${foodie.name}`);
  //     },
  //     onError: (err) => {
  //       console.log({ err });
  //       toast.error(err.message);
  //     },
  //   });
  // };

  const fullName =
    foodie?.fullName ??
    foodie?.make + " " + foodie?.model + " " + foodie?.modelYear;

  const onSendMessage = () => {
    let text = "";
    if (foodie.make) {
      text = `Hi! 👋

I am interested in your ${foodie.make} ${foodie.model} (${foodie.modelYear}). Is it still available?`;
    } else {
      text = `Hi ${fullName}! 👋

Would you be interested in buying a vehicle? Let me know if you're looking for something specific!`;
    }
    // console.log({ text });
    mutate(
      { text },
      {
        onSuccess: (res) => {
          console.log(res);
          setShowContact(false);
          toast.success("message sent successfully");
        },
        onError: (err) => {
          toast.error(err.message);
        },
      }
    );
  };

  return (
    <Card className="px-0 py-0 p-0 m-1 ring-1 ring-muted-foreground/30  rounded-2xl shadow-md border border-muted/30  hoverg-:shadow-lg transition-shadow duration-200 group ">
      <CardContent
        className={clsx(
          "relative p-0 px-2 py-2 flex flex-col gap-2 items-start text-center"
        )}
      >
        {foodie.phone && (
          <Button
            variant="link"
            size="sm"
            // disabled={isPending || Boolean(isInvited)}
            // onClick={onInvite}
            // onClick={() => setShowContact(true)}
            onClick={onSendMessage}
            className={clsx(
              "absolute right-0 h-6 px-2 text-xs",
              "disabled:cursor-not-allowed disabled:pointer-events-auto"
            )}
          >
            {isPending ? (
              <Loader2 className="animate-spin h-4 w-4" />
            ) : (
              "Send Message"
            )}
          </Button>
        )}
        <Dialog open={showContact} onOpenChange={setShowContact}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Send Whatsapp Message</DialogTitle>
            </DialogHeader>
            <Input
              value={contact}
              onChange={(e) => {
                const value = e.target.value;
                setContact(value);
                if (value && !isValidPhoneNumber(value)) {
                  setContactError(
                    "Please enter a valid WhatsApp number (e.g. 923337069742, 12 digits, no + or spaces)"
                  );
                } else {
                  setContactError("");
                }
              }}
              placeholder="Enter your WhatsApp contact"
            />
            {contactError && (
              <div className="text-xs text-red-500 mt-1">{contactError}</div>
            )}
            <Button
              disabled={!contact || !!contactError}
              onClick={onSendMessage}
            >
              {isPending ? (
                <Loader2 className="animate-spin h-4 w-4" />
              ) : (
                "Send Message"
              )}
            </Button>
          </DialogContent>
        </Dialog>
        <div className="flex items-center justify-center gap-2">
          <Avatar className="h-6 w-6 rounded-full flex items-center justify-center text-sm font-medium">
            <AvatarImage
              src={`https://ui-avatars.com/api/?background=random&bold=true&name=${encodeURIComponent(
                fullName
              )}`}
              alt={fullName}
            />
            <AvatarFallback>
              {fullName?.[0]}
              {fullName?.split(" ")[1]?.[0]}
            </AvatarFallback>
          </Avatar>

          <div
            className="text-lg font-semibold flex gap-2 items-center "
            title={fullName}
          >
            <span
              className="truncate overflow-hidden"
              style={{ color: foodie.color }}
            >
              {fullName}
            </span>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4" />
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  <b>MATCHED : </b>
                  {foodie.matchedPercentage}%{`\n`}
                </p>
                {foodie.interest && (
                  <>
                    <b>MATCHED INTERESTS : </b>
                    {foodie.interest}
                  </>
                )}
                {foodie.location && (
                  <>
                    <b>LOCATION : </b>
                    {foodie.location}
                  </>
                )}
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
        <div
          className="text-sm text-muted-foreground flex items-center gap-2 justify-start w-full truncate"
          title={foodie.email}
        >
          <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
          <span>{foodie.email}</span>
        </div>
        <div
          className="text-sm text-muted-foreground flex items-center gap-2 justify-start w-full truncate"
          title={foodie.phone}
        >
          <Phone className="w-4 h-4 text-muted-foreground" />
          <span>{foodie.phone}</span>
        </div>
        {foodie?.price && (
          <div
            className="text-sm text-muted-foreground flex items-center gap-2 justify-start w-full truncate"
            title={foodie.price?.toString()}
          >
            <BadgePercent className="w-4 h-4 text-muted-foreground" />
            <span>{foodie.price}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Foodie;
