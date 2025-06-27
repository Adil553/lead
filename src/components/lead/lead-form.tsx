"use client";
import { useLocation } from "@/context/location-context";
import { LeadRequestBody } from "@/utils/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useImperativeHandle, useState } from "react";
import { useForm } from "react-hook-form";
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
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";

const currentYear = new Date().getFullYear();

const formSchema = z
  .object({
    mode: z.enum(["buy", "sell"]).default("sell"),
    make: z
      .string()
      .min(3, "Please enter the vehicle make (at least 3 characters).")
      .regex(
        /^[a-zA-Z0-9 ]+$/,
        "Make can only contain letters, numbers, and spaces."
      ),
    model: z.string().optional(),
    modelMin: z.string().optional(),
    modelMax: z.string().optional(),
    price: z.string().optional(),
    priceMin: z.string().optional(),
    priceMax: z.string().optional(),
    cc: z.string().optional(),
    ccMin: z.string().optional(),
    ccMax: z.string().optional(),
    negotiable: z.number().optional(),
    area: z
      .string()
      .min(5, "Please enter a valid area or address (at least 5 characters)."),
  })
  .superRefine((data, ctx) => {
    if (data.mode === "buy") {
      // Price range validation
      if (!data.priceMin || !data.priceMax) {
        ctx.addIssue({
          path: ["priceMin"],
          message: "Enter price range",
          code: "custom",
        });
      } else {
        const min = Number(data.priceMin);
        const max = Number(data.priceMax);
        if (isNaN(min) || isNaN(max) || min < 0 || max < 0) {
          ctx.addIssue({
            path: ["priceMin"],
            message: "Price must be a positive number",
            code: "custom",
          });
        } else if (min > max) {
          ctx.addIssue({
            path: ["priceMin"],
            message: "Min price cannot be greater than max price",
            code: "custom",
          });
          ctx.addIssue({
            path: ["priceMax"],
            message: "Max price cannot be less than min price",
            code: "custom",
          });
        }
      }
      // CC range validation
      if (!data.ccMin || !data.ccMax) {
        ctx.addIssue({
          path: ["ccMin"],
          message: "Enter CC range",
          code: "custom",
        });
      } else {
        const min = Number(data.ccMin);
        const max = Number(data.ccMax);
        if (isNaN(min) || isNaN(max) || min < 0 || max < 0) {
          ctx.addIssue({
            path: ["ccMin"],
            message: "CC must be a positive number",
            code: "custom",
          });
        } else if (min > max) {
          ctx.addIssue({
            path: ["ccMin"],
            message: "Min CC cannot be greater than max CC",
            code: "custom",
          });
          ctx.addIssue({
            path: ["ccMax"],
            message: "Max CC cannot be less than min CC",
            code: "custom",
          });
        }
      }
      // Model year range validation
      if (!data.modelMin || !data.modelMax) {
        ctx.addIssue({
          path: ["modelMin"],
          message: "Enter model year range",
          code: "custom",
        });
      } else {
        const min = Number(data.modelMin);
        const max = Number(data.modelMax);
        if (isNaN(min) || isNaN(max)) {
          ctx.addIssue({
            path: ["modelMin"],
            message: "Model years must be numbers",
            code: "custom",
          });
        } else {
          if (min > max) {
            ctx.addIssue({
              path: ["modelMin"],
              message: "Min year cannot be greater than max year",
              code: "custom",
            });
            ctx.addIssue({
              path: ["modelMax"],
              message: "Max year cannot be less than min year",
              code: "custom",
            });
          }
          if (min > currentYear) {
            ctx.addIssue({
              path: ["modelMin"],
              message: `Min year cannot be greater than ${currentYear}`,
              code: "custom",
            });
          }
          if (max > currentYear) {
            ctx.addIssue({
              path: ["modelMax"],
              message: `Max year cannot be greater than ${currentYear}`,
              code: "custom",
            });
          }
        }
      }
    } else {
      if (!data.price) {
        ctx.addIssue({
          path: ["price"],
          message: "Enter price",
          code: "custom",
        });
      }
      if (!data.cc) {
        ctx.addIssue({ path: ["cc"], message: "Enter CC", code: "custom" });
      }
      if (typeof data.negotiable !== "number") {
        ctx.addIssue({
          path: ["negotiable"],
          message: "Set negotiable percentage",
          code: "custom",
        });
      }
      if (!data.model) {
        ctx.addIssue({
          path: ["model"],
          message: "Enter model year",
          code: "custom",
        });
      } else {
        const modelYear = Number(data.model);
        if (isNaN(modelYear)) {
          ctx.addIssue({
            path: ["model"],
            message: "Model year must be a number",
            code: "custom",
          });
        } else if (modelYear > currentYear) {
          ctx.addIssue({
            path: ["model"],
            message: `Model year cannot be greater than ${currentYear}`,
            code: "custom",
          });
        }
      }
    }
  });

type LeadFormProps = {
  onGenerateLead: (leadBody: LeadRequestBody) => void;
  isPending: boolean;
  formRef?: React.MutableRefObject<{
    getAllFormValues: () => LeadRequestBody;
  } | null>;
};

const LeadForm: React.FC<LeadFormProps> = ({
  onGenerateLead,
  isPending,
  formRef,
}) => {
  const { selectedPosition } = useLocation();
  const [mode, setMode] = useState<"buy" | "sell">("sell");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mode: "sell",
      make: "",
      model: "",
      modelMin: "",
      modelMax: "",
      price: "",
      priceMin: "",
      priceMax: "",
      cc: "",
      ccMin: "",
      ccMax: "",
      negotiable: 0,
      area: "",
    },
  });

  // Expose getAllFormValues via the formRef prop
  useImperativeHandle(formRef, () => ({
    getAllFormValues: () => {
      const extractAddress = form.getValues("area").split(", ");
      const lastItem = extractAddress[extractAddress.length - 1] || "";
      const mode = form.getValues("mode");
      if (mode === "buy") {
        return {
          address: form.getValues("area"),
          make: form.getValues("make"),
          priceMin: form.getValues("priceMin"),
          priceMax: form.getValues("priceMax"),
          ccMin: form.getValues("ccMin"),
          ccMax: form.getValues("ccMax"),
          modelMin: form.getValues("modelMin"),
          modelMax: form.getValues("modelMax"),
          latitude: selectedPosition?.[0] ?? 0,
          longitude: selectedPosition?.[1] ?? 0,
          city: lastItem,
          query: "",
          mode,
        };
      } else {
        return {
          address: form.getValues("area"),
          make: form.getValues("make"),
          price: form.getValues("price"),
          cc: form.getValues("cc"),
          model: form.getValues("model"),
          negotiable: form.getValues("negotiable"),
          latitude: selectedPosition?.[0] ?? 0,
          longitude: selectedPosition?.[1] ?? 0,
          city: lastItem,
          query: "",
          mode,
        };
      }
    },
  }));

  function onSubmit(values: z.infer<typeof formSchema>) {
    const extractAddress = values.area.split(", ");
    const lastItem = extractAddress[extractAddress.length - 1] || "";
    let leadBody: LeadRequestBody;
    if (values.mode === "buy") {
      leadBody = {
        address: values.area,
        make: values.make,
        priceMin: values.priceMin ?? "",
        priceMax: values.priceMax ?? "",
        ccMin: values.ccMin ?? "",
        ccMax: values.ccMax ?? "",
        modelMin: values.modelMin ?? "",
        modelMax: values.modelMax ?? "",
        latitude: selectedPosition?.[0] ?? 0,
        longitude: selectedPosition?.[1] ?? 0,
        city: lastItem,
        query: "",
        mode: values.mode,
      };
    } else {
      leadBody = {
        address: values.area,
        make: values.make,
        price: values.price ?? "",
        cc: values.cc ?? "",
        model: values.model ?? "",
        negotiable: values.negotiable ?? 0,
        latitude: selectedPosition?.[0] ?? 0,
        longitude: selectedPosition?.[1] ?? 0,
        city: lastItem,
        query: "",
        mode: values.mode,
      };
    }
    onGenerateLead(leadBody);
  }

  // Handler to update area/address in the form when selected from AddressSearch
  const handleAddressSelect = (address: string) => {
    form.setValue("area", address, { shouldValidate: true });
  };
  // console.log(form.formState.errors);
  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-2 w-[100%] mt-3"
        >
          {/* Buy/Sell radio group */}
          <FormField
            control={form.control}
            name="mode"
            render={({ field }) => (
              <FormItem className="flex items-center justify-center">
                <FormLabel>Mode</FormLabel>
                <FormControl>
                  <RadioGroup
                    disabled={isPending}
                    value={field.value}
                    onValueChange={(val) => {
                      field.onChange(val as "buy" | "sell");
                      setMode(val as "buy" | "sell");
                    }}
                    orientation="vertical"
                    className="flex"
                  >
                    <RadioGroupItem value="sell" id="r1" />
                    <Label htmlFor="r1">Sell for me</Label>
                    <RadioGroupItem value="buy" id="r2" />
                    <Label htmlFor="r2">Buy for me</Label>
                  </RadioGroup>
                </FormControl>
              </FormItem>
            )}
          />
          {/* Make */}
          <FormField
            control={form.control}
            name="make"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Make</FormLabel>
                <FormControl>
                  <Input disabled={isPending} placeholder="Make" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Model */}
          {mode === "buy" ? (
            <div className="flex gap-2">
              <FormField
                control={form.control}
                name="modelMin"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Model Year Min</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isPending}
                        placeholder="Min Year"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="modelMax"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Model Year Max</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isPending}
                        placeholder="Max Year"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          ) : (
            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Model Year</FormLabel>
                  <FormControl>
                    <Input disabled={isPending} placeholder="Year" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          {/* Price and Negotiable in one row (sell mode only) */}
          {mode === "buy" ? (
            <>
              {/* Price Range */}
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
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              {/* CC Range */}
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
            </>
          ) : (
            <>
              {/* Price and Negotiable in one row */}
              <div className="flex gap-2">
                <div className="flex-9/12">
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
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex-1/5">
                  <FormField
                    control={form.control}
                    name="negotiable"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Negotiable (%)</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value ? String(field.value) : ""}
                            onValueChange={(val) => field.onChange(Number(val))}
                            disabled={isPending}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select negotiable %" />
                            </SelectTrigger>
                            <SelectContent>
                              {[5, 10, 15, 20, 25, 30].map((percent) => (
                                <SelectItem
                                  key={percent}
                                  value={String(percent)}
                                >
                                  {percent}%
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              {/* CC (single) */}
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
            </>
          )}
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
