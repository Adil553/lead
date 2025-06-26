"use client";
import Header from "@/components/layout/Header";
import LeadForm from "@/components/lead/lead-form";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

export default function Home() {
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
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 text-balance">
            Instantly Generate AI-Powered Leads
          </h1>
          <p className="text-xl text-foreground mb-8 max-w-2xl mx-auto text-pretty">
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
              <LeadForm />
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
