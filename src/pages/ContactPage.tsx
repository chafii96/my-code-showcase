import Layout from "@/components/Layout";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import SEOHead from "@/components/SEOHead";
import { Link } from "react-router-dom";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { Mail, MessageSquare, HelpCircle } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const ContactPage = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent",
      description: "Thank you for contacting us. We'll get back to you within 24-48 hours.",
    });
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <Layout>
      <SEOHead
        title="Contact Us - US Postal Tracking"
        description="Get in touch with US Postal Tracking. Send us your questions, feedback, or suggestions and we'll respond within 24-48 hours."
        canonical="/contact"
      />
      <div className="container py-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem><BreadcrumbLink asChild><Link to="/">Home</Link></BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbPage>Contact Us</BreadcrumbPage></BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="container max-w-3xl pb-16">
        <header className="mb-10 text-center">
          <div className="flex items-center justify-center gap-2 text-accent text-sm font-semibold uppercase tracking-wider mb-3">
            <Mail className="h-4 w-4" /> Get In Touch
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Contact Us</h1>
          <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
            Have a question or feedback? Fill out the form below and we'll get back to you as soon as possible.
          </p>
        </header>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {[
            { icon: Mail, title: "Email", desc: "support@uspostaltracking.com" },
            { icon: MessageSquare, title: "Response Time", desc: "24-48 hours" },
            { icon: HelpCircle, title: "FAQ", desc: "Check our FAQ section first" },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="text-center p-4 bg-card border rounded-xl">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground text-sm">{item.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
              </div>
            );
          })}
        </div>

        <form onSubmit={handleSubmit} className="bg-card border rounded-xl p-6 md:p-8 space-y-5">
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1.5">Full Name</label>
              <input
                id="name"
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-lg border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">Email Address</label>
              <input
                id="email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-lg border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="john@example.com"
              />
            </div>
          </div>
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-1.5">Subject</label>
            <input
              id="subject"
              type="text"
              required
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              className="w-full rounded-lg border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              placeholder="Tracking question"
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-foreground mb-1.5">Message</label>
            <textarea
              id="message"
              required
              rows={5}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full rounded-lg border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
              placeholder="How can we help you?"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary text-primary-foreground font-semibold py-3 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Send Message
          </button>
        </form>

        <div className="mt-8 bg-muted/50 border rounded-xl p-6 text-center">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Note:</strong> We are an independent tracking service and cannot modify or
            update your USPS shipment. For official USPS inquiries, please visit{" "}
            <a href="https://www.usps.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">usps.com</a>.
          </p>
        </div>
      </div>
      <BreadcrumbSchema items={[
        { name: "Home", url: "/" },
        { name: "Contact Us", url: "/contact" },
      ]} />
    </Layout>
  );
};

export default ContactPage;
