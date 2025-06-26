"use client";
import { useLocation } from "@/context/location-context";
import { useGenerateLead } from "@/hooks/useMistralAI";
import { LeadRequestBody } from "@/utils/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import AddressSearch from "./address-search";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import Foodie from "./foodie";
import { SearchBar } from "../ui/search-bar";

const currentYear = new Date().getFullYear();

const formSchema = z.object({
  make: z
    .string()
    .min(3, "Please enter the vehicle make (at least 3 characters).")
    .regex(
      /^[a-zA-Z0-9 ]+$/,
      "Make can only contain letters, numbers, and spaces."
    ),
  model: z
    .string()
    .min(1, "Please enter the vehicle model.")
    .regex(/^[0-9]{4}$/, "Model year must be a 4-digit number.")
    .refine(
      (val) => {
        const year = Number(val);
        return year <= currentYear;
      },
      {
        message: `Model year cannot be greater than ${currentYear}.`,
      }
    ),
  price: z
    .string()
    .nonempty("Please enter the price.")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Price must be a positive number.",
    }),
  cc: z
    .string()
    .nonempty("Please enter the engine CC.")
    .max(4, "CC must be at most 4 digits.")
    .regex(/^\d+$/, "CC must be a number."),
  area: z
    .string()
    .min(5, "Please enter a valid area or address (at least 5 characters)."),
});

const LeadForm = () => {
  const [showLeads, setShowLeads] = useState(false);
  const [search, setSearch] = useState("");

  const { selectedPosition } = useLocation();
  const { mutate, isPending, data } = useGenerateLead();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      make: "",
      model: "",
      price: "",
      cc: "",
      area: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    const extractAddress = values.area.split(", ");
    const lastItem = extractAddress[extractAddress.length - 1];
    const leadBody: LeadRequestBody = {
      address: values.area,
      make: values.make,
      price: values.price,
      cc: values.cc,
      model: values.model,
      latitude: selectedPosition?.[0] ?? 0,
      longitude: selectedPosition?.[1] ?? 0,
      city: lastItem,
    };
    // console.log({ leadBody });
    mutate(leadBody, {
      onSuccess: (res) => {
        // console.log(res);
        if (res && Array.isArray(res)) {
          setShowLeads(true);
        }
      },
      onError: (err) => {
        console.log({ err });
        toast.error(err.message);
      },
    });
  }

  // Handler to update area/address in the form when selected from AddressSearch
  const handleAddressSelect = (address: string) => {
    form.setValue("area", address, { shouldValidate: true });
  };

  // 3. Filter data based on search
  const filteredData =
    data && Array.isArray(data)
      ? data.filter(
          (foodie) =>
            foodie.fullName?.toLowerCase().includes(search.toLowerCase()) ||
            foodie.email?.toLowerCase().includes(search.toLowerCase()) ||
            foodie.phone?.toLowerCase().includes(search.toLowerCase())
        )
      : [];

  return (
    <>
      <Dialog open={showLeads} onOpenChange={setShowLeads}>
        <DialogContent className="max-w-2xl w-full gap-2 p-6 rounded-3xl bg-background border-0 shadow-lg shadow-card">
          <DialogHeader className="flex-row items-center">
            <DialogTitle>Leads For You By AI </DialogTitle>
          </DialogHeader>
          <div className="mb-2">
            <SearchBar
              onSearch={setSearch}
              placeholder="Search by name, email, or phone"
              disabled={isPending}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-2 max-h-[60dvh] overflow-y-scroll scrollbar-hide">
            {filteredData.length > 0 ? (
              filteredData.map((foodie, index) => (
                <Foodie key={index} foodie={foodie} invitedList={[]} />
              ))
            ) : (
              <div className="col-span-2 text-center text-muted-foreground">
                No results found.
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-3 w-[100%]"
        >
          {/* Make and Model in one row */}
          <div className="flex gap-3">
            <div className="flex-1">
              <FormField
                control={form.control}
                name="make"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Make</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isPending}
                        placeholder="Make"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex-1">
              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Model</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isPending}
                        placeholder="Model"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          {/* Price and CC in one row */}
          <div className="flex gap-3">
            <div className="flex-1">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isPending}
                        placeholder="Price"
                        type="number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex-1">
              <FormField
                control={form.control}
                name="cc"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CC</FormLabel>
                    <FormControl>
                      <Input disabled={isPending} placeholder="CC" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          {/* Area/Address as textarea */}
          <FormField
            control={form.control}
            name="area"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <div>
                    <AddressSearch
                      value={field.value}
                      onChange={handleAddressSelect}
                      disabled={isPending}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            variant={"default"}
            className="w-full"
            disabled={isPending}
          >
            {isPending && <Loader2 className="animate-spin" />}
            Submit
          </Button>
        </form>
      </Form>
    </>
  );
};
export default LeadForm;
