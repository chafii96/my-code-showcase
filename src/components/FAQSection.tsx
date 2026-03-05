import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { faqData } from "@/data/mockTracking";
import { HelpCircle } from "lucide-react";

const FAQSection = () => {
  return (
    <section id="faq" className="container py-16">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-3">
            <HelpCircle className="h-5 w-5 text-accent" />
            <span className="text-sm font-semibold text-accent uppercase tracking-wider">FAQ</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">Frequently Asked Questions</h2>
          <p className="text-muted-foreground mt-2">Everything you need to know about USPS tracking</p>
        </div>

        <Accordion type="single" collapsible className="space-y-3">
          {faqData.map((item, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className="bg-card border rounded-lg px-6">
              <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* JSON-LD Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: faqData.map((item) => ({
                "@type": "Question",
                name: item.question,
                acceptedAnswer: { "@type": "Answer", text: item.answer },
              })),
            }),
          }}
        />
      </div>
    </section>
  );
};

export default FAQSection;
