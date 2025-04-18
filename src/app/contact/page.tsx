"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Schema for the Contact Us form
const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export default function ContactPage() {
  const { toast } = useToast();

  // Contact Us form
  const contactForm = useForm<z.infer<typeof contactFormSchema>>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  // Handle Contact Us form submission
  async function onContactSubmit(values: z.infer<typeof contactFormSchema>) {
    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        toast({
          title: "Message sent!",
          description: "We'll get back to you as soon as possible.",
        });
        contactForm.reset();
      } else {
        toast({
          title: "Error",
          description: "Failed to send message. Please try again later.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: "An error occurred while sending the message.",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="container p-12">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-green-600">Get in Touch</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Have questions about our products.
          We're here to help! Reach out to us through any of the following channels.
        </p>
      </div>

      {/* Contact Info and Form - Same Level */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Contact Information */}
        <div className="grid gap-6">
          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <MapPin className="h-6 w-6 text-primary" />
              <div>
                <h3 className="font-semibold">Address</h3>
                <p className="text-sm text-muted-foreground">
                  123 Thamel Marg<br />
                  Kathmandu 44600<br />
                  Nepal
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <Phone className="h-6 w-6 text-primary" />
              <div>
                <h3 className="font-semibold">Phone</h3>
                <p className="text-sm text-muted-foreground">
                  +977 9841885972<br />
                  +977 9813610009
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <Mail className="h-6 w-6 text-primary" />
              <div>
                <h3 className="font-semibold">Email</h3>
                <p className="text-sm text-muted-foreground">
                 rujanshakya39@gmail.com<br />
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <Globe className="h-6 w-6 text-primary" />
              <div>
                <h3 className="font-semibold">Office Hours</h3>
                <p className="text-sm text-muted-foreground">
                  Sunday - Friday: 10:00 AM - 7:00 PM<br />
                  Saturday: 11:00 AM - 7:00 PM
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Form */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold mb-6">Send us a Message</h2>
            <Form {...contactForm}>
              <form
                onSubmit={contactForm.handleSubmit(onContactSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={contactForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={contactForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="your.email@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={contactForm.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject</FormLabel>
                      <FormControl>
                        <Input placeholder="What is this about?" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={contactForm.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Your message here..."
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full bg-green-600">
                  Send Message
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      {/* Map Section */}
      <div className="rounded-xl overflow-hidden shadow-lg">
        <div className="relative h-[450px] w-full">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.2704812876712!2d85.31080581506272!3d27.71568798278928!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb18fcb77fd4bd%3A0x58099b1daa43b6ca!2sThamel%2C%20Kathmandu%2044600%2C%20Nepal!5e0!3m2!1sen!2s!4v1648636547953!5m2!1sen!2s"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <div className="absolute bottom-4 right-4 bg-white px-4 py-2 rounded-lg shadow-md">
            <a
              href="https://www.google.com/maps/place/Melting+Pot+%2F+Juju+Wears/@27.7135959,85.3099314,17z/data=!3m1!4b1!4m6!3m5!1s0x39eb19fc94445faf:0xf74ba7ad747fe124!8m2!3d27.7135912!4d85.3125063!16s%2Fg%2F11f7b498s2?entry=ttu&g_ep=EgoyMDI1MDQxNi4xIKXMDSoASAFQAw%3D%3D"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline flex items-center gap-2"
            >
              <MapPin className="h-4 w-4" />
              <span className="text-green-600">Open in Google Maps</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}