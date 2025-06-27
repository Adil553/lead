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

const formSchema = z
  .object({
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
    priceMin: z
      .string()
      .nonempty("Please enter the minimum price.")
      .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
        message: "Minimum price must be a positive number.",
      }),
    priceMax: z
      .string()
      .nonempty("Please enter the maximum price.")
      .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
        message: "Maximum price must be a positive number.",
      }),
    ccMin: z
      .string()
      .nonempty("Please enter the minimum engine CC.")
      .max(4, "CC must be at most 4 digits.")
      .regex(/^\d+$/, "CC must be a number."),
    ccMax: z
      .string()
      .nonempty("Please enter the maximum engine CC.")
      .max(4, "CC must be at most 4 digits.")
      .regex(/^\d+$/, "CC must be a number."),
    area: z
      .string()
      .min(5, "Please enter a valid area or address (at least 5 characters)."),
  })
  .refine((data) => Number(data.priceMin) <= Number(data.priceMax), {
    message: "Minimum price cannot be greater than maximum price.",
    path: ["priceMax"],
  })
  .refine((data) => Number(data.ccMin) <= Number(data.ccMax), {
    message: "Minimum CC cannot be greater than maximum CC.",
    path: ["ccMax"],
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
      priceMin: "",
      priceMax: "",
      ccMin: "",
      ccMax: "",
      area: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const extractAddress = values.area.split(", ");
    const lastItem = extractAddress[extractAddress.length - 1];
    const leadBody: LeadRequestBody = {
      address: values.area,
      make: values.make,
      priceMin: values.priceMin,
      priceMax: values.priceMax,
      ccMin: values.ccMin,
      ccMax: values.ccMax,
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

  //   const prompt = `
  //   You are a vehicle sales assistant with access to a web_search tool and geolocation services.

  // 🚗 Vehicle Listing:
  // - Make: ${values.make}
  // - Model: ${values.model}
  // - Price: ${values.price}
  // - Engine CC: ${values.cc}
  // - Address: ${values.area}
  // - Location: ${selectedPosition?.[0] ?? 0}, ${selectedPosition?.[1] ?? 0}

  // 🎯 Task:
  // 1. Use web_search to find real user leads (buyers/sellers) interested in similar vehicles.
  // 2. Identify car showrooms/dealerships near the provided location that sell ${
  //     values.make
  //   } or similar vehicles.

  // 📍 Location Priority:
  // - Prioritize leads within 10km of the coordinates (${leadBody.latitude}, ${
  //     leadBody.longitude
  //   }) or the provided address (${values.area}).
  // - If coordinates are missing, use a geocoding service to derive them from the address.
  // - Extract the city from the address (e.g., Lahore) for broader matching if proximity yields insufficient results.
  // - Default to the city/region if address parsing fails.

  // 📝 Output:
  // Return a single JSON array of 8-12 objects, each containing:
  // - fullName: string (real name or showroom name make sure showroom data is not fake)
  // - phone: string (real or "N/A" if unavailable)
  // - email: string (real, no placeholders like @example.com; use "N/A" if unavailable)
  // - interest: string (comma-separated, e.g., "${values.make} ${values.model}, ${
  //     values.cc
  //   }cc, ${leadBody.city}")
  // - isShowroom: boolean (true for showrooms, false for individuals)

  // ⚠️ Rules:
  // - Source real leads from public platforms (e.g., social media, dealership websites).
  // - Do not fabricate contact details; use "N/A" for missing data.
  // - Return only a raw JSON array, no markdown, explanations, or additional text.
  // - Ensure leads are relevant to the vehicle (make, model, cc) and location.
  //   `;

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
          {/* Price and CC in one row, each with min/max */}
          <div className="flex gap-3">
            <div className="flex-1">
              <div className="flex gap-2">
                <FormField
                  control={form.control}
                  name="priceMin"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Price Min</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isPending}
                          placeholder="Min"
                          type="number"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="priceMax"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Price Max</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isPending}
                          placeholder="Max"
                          type="number"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex gap-2">
                <FormField
                  control={form.control}
                  name="ccMin"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>CC Min</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isPending}
                          placeholder="Min"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="ccMax"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>CC Max</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isPending}
                          placeholder="Max"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
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
