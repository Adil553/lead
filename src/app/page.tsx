"use client";
import Header from "@/components/layout/Header";
import Foodie from "@/components/lead/foodie";
import LeadFilter from "@/components/lead/lead-filter";
import LeadForm from "@/components/lead/lead-form";
import { Card, CardContent } from "@/components/ui/card";
import { SearchBar } from "@/components/ui/search-bar";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  defaultContactWords,
  defaultEmailWords,
  defaultNameWords,
} from "@/constants/constants";
import { useGenerateLead } from "@/hooks/useMistralAI";
import { hasExactlyOneSpace } from "@/lib/utils";
import { LeadRequestBody } from "@/utils/types";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

export default function Home() {
  const [emailWords, setEmailWords] = useState<string[]>(defaultEmailWords);
  const [contactWords, setContactWords] =
    useState<string[]>(defaultContactWords);
  const [nameWords, setNameWords] = useState<string[]>(defaultNameWords);
  const [search, setSearch] = useState("");
  const formRef = useRef<{ getAllFormValues: () => LeadRequestBody } | null>(
    null
  );
  const { mutate, isPending, data } = useGenerateLead();
  const isSearchQuery = useMemo(() => hasExactlyOneSpace(search), [search]);

  function onSubmit(leadBody: LeadRequestBody) {
    mutate(
      {
        ...leadBody,
        nameWords: nameWords,
        emailWords: emailWords,
        contactWords: contactWords,
      },
      {
        onSuccess: (res) => {
          console.log(res);
        },
        onError: (err) => {
          console.log({ err });
          toast.error(err.message);
        },
      }
    );
  }

  // Refetch suggestions when isSearchQuery is true
  useEffect(() => {
    if (isSearchQuery && formRef?.current) {
      const values = formRef?.current.getAllFormValues();
      const extractAddress = values.address ? values.address.split(", ") : "";
      const lastItem = extractAddress[extractAddress.length - 1];
      const leadBody: LeadRequestBody = {
        ...values,
        city: lastItem,
        query: search, // Pass the search as query
        nameWords: nameWords,
        emailWords: emailWords,
        contactWords: contactWords,
      };
      mutate(leadBody, {
        onSuccess: (res) => {
          console.log({ res });
        },
        onError: (err) => {
          toast.error(err.message);
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSearchQuery, search]); // Add mutate, form, selectedPosition if needed

  const filteredData =
    data && Array.isArray(data) && !isSearchQuery
      ? data.filter(
          (foodie) =>
            foodie.fullName?.toLowerCase().includes(search.toLowerCase()) ||
            foodie.email?.toLowerCase().includes(search.toLowerCase()) ||
            foodie.make?.toLowerCase().includes(search.toLowerCase()) ||
            foodie.model?.toLowerCase().includes(search.toLowerCase()) ||
            foodie.phone?.toLowerCase().includes(search.toLowerCase())
        )
      : data && Array.isArray(data)
      ? data
      : [];
  return (
    <main className="flex min-h-screen flex-col hide-scrollbar">
      <Header />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center hide-scrollbar ">
        <div className="absolute inset-0 z-0">
          <Image
            src="/logo.png"
            alt="Hero Background"
            fill
            className="object-cover opacity-25"
            priority
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>
        <div className="container mx-auto px-4 z-10 text-center">
          <h1 className="text-4xl  font-bold text-foreground mb-2 text-balance">
            Instantly Generate AI-Powered Leads
          </h1>
          <p className="text-sm text-foreground mb-2 max-w-full mx-auto text-balance">
            Submit your information and let our AI match you with a curated list
            of potential users or leads tailored to your needs. Fill out the
            form below to get started and receive high-quality connections
            generated just for you.
          </p>
          <Card className="bg-card/80">
            {/* <CardHeader>
              <CardTitle>Vehicle Information</CardTitle>
            </CardHeader> */}
            <CardContent>
              <div className="mb-2 flex-1">
                {filteredData.length > 0 && (
                  <div className="my-2">
                    <SearchBar
                      onSearch={setSearch}
                      placeholder="Search by name, email, or phone"
                      disabled={isPending}
                      isLoading={isPending}
                    />
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-2 max-h-[25dvh] overflow-y-scroll scrollbar-hide">
                  {isPending &&
                    Array(4)
                      .fill(null)
                      .map((_, i) => (
                        <div key={i} className="flex flex-col space-y-2">
                          <Skeleton className="flex flex-col rounded-xl h-[100px] items-start p-2">
                            <div className="flex items-center space-x-4">
                              <Skeleton className="h-10 w-10 rounded-full bg-background" />
                              <div className="">
                                <Skeleton className="h-4 w-[150px] bg-background" />
                              </div>
                            </div>
                            <div className="flex gap-1 my-1">
                              <Skeleton className="h-4 w-4 rounded-full bg-background" />
                              <Skeleton className="h-4 w-[150px] bg-background" />
                            </div>
                            <div className="flex gap-1">
                              <Skeleton className="h-4 w-4 rounded-full bg-background" />
                              <Skeleton className="h-4 w-[150px] bg-background" />
                            </div>
                          </Skeleton>
                        </div>
                      ))}
                  {filteredData.length > 0
                    ? filteredData.map((foodie, index) => (
                        <Foodie key={index} foodie={foodie} invitedList={[]} />
                      ))
                    : !isPending &&
                      data &&
                      Array.isArray(data) &&
                      data?.length > 0 && (
                        <div className="col-span-2 text-center text-muted-foreground">
                          No results found.
                        </div>
                      )}
                </div>
              </div>
              {data && Array.isArray(data) && data?.length > 0 && <Separator />}
              <div className="relative flex-1">
                <LeadFilter
                  emailWords={emailWords}
                  contactWords={contactWords}
                  nameWords={nameWords}
                  setContactWords={setContactWords}
                  setNameWords={setNameWords}
                  setEmailWords={setEmailWords}
                />
                <LeadForm
                  onGenerateLead={onSubmit}
                  isPending={isPending}
                  formRef={formRef}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background hide-scrollbar">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Use Our AI Lead Generation
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-4">
                AI-Powered Matching
              </h3>
              <p className="text-muted-foreground">
                Our advanced AI analyzes your input to generate a list of the
                most relevant users or leads, ensuring you get the best possible
                matches for your requirements.
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-4">Fast & Effortless</h3>
              <p className="text-muted-foreground">
                Submit your details in seconds and receive your personalized
                lead list quickly, without any hassle or delays.
              </p>
            </div>
            <div className="bg-card p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-4">
                Quality Connections
              </h3>
              <p className="text-muted-foreground">
                We focus on delivering high-quality, relevant leads so you can
                connect with the right people and grow your network or business
                efficiently.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      {/* <Footer /> */}
    </main>
  );
}
