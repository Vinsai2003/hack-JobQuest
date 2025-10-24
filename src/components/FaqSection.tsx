"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";

export default function FaqSection() {
  const faqItems = [
    {
      id: "item-1",
      question: "How does JobQuest match me with jobs?",
      answer:
        "JobQuest uses smart keyword matching to compare your skills and interests with job requirements, providing personalized recommendations.",
    },
    {
      id: "item-2",
      question: "Can I save jobs for later review?",
      answer:
        "Yes, JobQuest lets you bookmark jobs and track your applications in one convenient dashboard.",
    },
    {
      id: "item-3",
      question: "Are interview prep resources available?",
      answer:
        "Access sample interview questions, practice materials, and a resume builder to help you prepare.",
    },
    {
      id: "item-4",
      question: "Can I track my job applications?",
      answer:
        "Monitor your application status and saved jobs easily through your personal dashboard.",
    },
    {
      id: "item-5",
      question: "Is JobQuest easy to navigate?",
      answer:
        "JobQuest is designed for students with intuitive search filters and a clean, responsive interface.",
    },
  ];

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-2xl px-6">
        <div className="space-y-12">
          <h2 className="text-foreground text-center text-4xl font-semibold">
            Frequently asked questions
          </h2>

          <Accordion type="single" collapsible className="-mx-2 sm:mx-0">
            {faqItems.map((item) => (
              <div className="group" key={item.id}>
                <AccordionItem
                  value={item.id}
                  className="data-[state=open]:bg-violet-200 peer rounded-xl border-none px-5 py-1 data-[state=open]:border-none md:px-7"
                >
                  <AccordionTrigger className="cursor-pointer text-base hover:no-underline">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-base">{item.answer}</p>
                  </AccordionContent>
                </AccordionItem>
                <hr className="mx-5 -mb-px group-last:hidden peer-data-[state=open]:opacity-0 md:mx-7" />
              </div>
            ))}
          </Accordion>

          <p className="text-muted-foreground text-center">
            Need help? Contact our{" "}
            <Link href="#" className="text-primary font-medium hover:underline">
              support team
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}