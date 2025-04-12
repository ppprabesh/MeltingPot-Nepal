"use client";

import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function Categories() {
  const categories = [
    {
      id: 1,
      title: "JUJU Wears",
      description: "Discover our collection of trendy and comfortable JUJU Wears, perfect for any occasion.",
      image: "/images/categories/juju-wears.jpg",
      link: "/juju-wears",
      color: "from-primary/80 to-primary/60"
    },
    {
      id: 2,
      title: "Karuna Wears",
      description: "Explore our elegant Karuna Wears collection, designed with style and sophistication in mind.",
      image: "/images/categories/karuna-wears.jpg",
      link: "/karuna-wears",
      color: "from-secondary/80 to-secondary/60"
    },
    {
      id: 3,
      title: "Mheecha",
      description: "Experience the unique Mheecha collection, where tradition meets contemporary fashion.",
      image: "/images/categories/mheecha.jpg",
      link: "/mheecha",
      color: "from-accent/80 to-accent/60"
    },
    {
      id: 4,
      title: "Yachu",
      description: "Indulge in the luxurious Yachu collection, crafted for those who appreciate premium quality.",
      image: "/images/categories/yachu.jpg",
      link: "/yachu",
      color: "from-primary/60 to-secondary/60"
    }
  ];

  return (
    <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Our Categories</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Explore our diverse range of products across different categories
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <Card key={category.id} className="overflow-hidden transition-all hover:shadow-lg">
            <div className={`h-48 relative bg-gradient-to-br ${category.color}`}>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="text-white text-xl font-bold">{category.title.charAt(0)}</span>
                </div>
              </div>
            </div>
            <CardHeader>
              <CardTitle>{category.title}</CardTitle>
              <CardDescription>{category.description}</CardDescription>
            </CardHeader>
            <CardFooter>
              <Link href={category.link} className="w-full">
                <Button className="w-full">Shop Now</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}