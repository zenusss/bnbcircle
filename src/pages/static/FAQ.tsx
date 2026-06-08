import React from "react";
import { SEO } from "@/components/SEO";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// FAQ data — exact content from bnb-circle.com
const faqs: { question: string; answer: string }[] = [
  {
    question: "Are all properties verified?",
    answer: "Properties are verified by the Bnb Circle team.",
  },
  {
    question: "How do I become a host?",
    answer:
      "Click 'List your property', fill in the details and publish your listing. Our team will guide you step by step.",
  },
  {
    question: "What fees does Bnb Circle charge?",
    answer:
      "Bnb Circle charges a 12% platform fee on top of the host's price. This covers payment processing, customer support, and platform maintenance.",
  },
  {
    question: "How are reviews verified?",
    answer:
      "Only guests who completed a booking and stayed at a property can leave reviews.",
  },
  {
    question: "Can I message the host before booking?",
    answer:
      "Yes, you can send a message to any host through the property listing page before making a booking.",
  },
  {
    question: "What if something is wrong with the property?",
    answer:
      "Contact our support team immediately. We offer resolution assistance and may help with rebooking or refunds.",
  },
  {
    question: "Do you offer long-term stays?",
    answer:
      "Yes, many hosts offer weekly and monthly discounts. Check the property details for available discounts.",
  },
];

export default function FAQ() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <div className="max-w-2xl mx-auto">
        {/* SEO */}
        <SEO title="FAQ" description="Everything you need to know about using BnbCircle." />
        {/* Header */}
        <h1 className="text-3xl md:text-4xl font-heading font-bold mb-3">
          Frequently Asked Questions
        </h1>
        <p className="text-[15px] text-muted-foreground mb-10">
          Everything you need to know about using Bnb Circle.
        </p>

        {/* Accordion */}
        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-card rounded-lg border border-border px-6"
            >
              <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
