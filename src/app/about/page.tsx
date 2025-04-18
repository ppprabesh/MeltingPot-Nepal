import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

export const AboutUsPage = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl text-green-800 font-bold mb-8">About The Melting Pot</h1>
        
        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="text-2xl text-green-800 font-semibold mb-4">Our Journey</h2>
            <p className="text-muted-foreground mb-6">
              Established in 2016, The Melting Pot began its journey in the heart of Patan, Lalitpur, as a small boutique dedicated to showcasing the finest Nepali craftsmanship. Following the devastating earthquake, we relocated to Thamel, where we continue to serve our valued customers with the same commitment to quality and authenticity.
            </p>
            
            <div className="relative w-full h-64 mb-6 rounded-lg overflow-hidden">
              <Image
                src="/images/shop1.jpg"
                alt="The Melting Pot Store"
                fill
                className="object-cover"
              />
            </div>

            <h2 className="text-2xl text-green-800 font-semibold mb-4">Our Mission</h2>
            <p className="text-muted-foreground mb-6">
              At The Melting Pot, we are committed to promoting Nepali craftsmanship and sustainable fashion. Our mission is to provide high-quality, ethically made products while supporting local artisans and preserving traditional techniques.
            </p>

            <h2 className="text-2xl text-green-800 font-semibold mb-4">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-green-800">Quality</CardTitle>
                </CardHeader>
                <CardContent>
                  We maintain the highest standards in materials and craftsmanship, ensuring every product meets our rigorous quality requirements.
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-green-800">Sustainability</CardTitle>
                </CardHeader>
                <CardContent>
                  We prioritize eco-friendly practices and materials, working towards a more sustainable future for Nepali fashion.
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-green-800">Community</CardTitle>
                </CardHeader>
                <CardContent>
                  We actively support local artisans and communities, helping to preserve traditional crafts and create sustainable livelihoods.
                </CardContent>
              </Card>
            </div>

            <h2 className="text-2xl text-green-800 font-semibold mb-4">Our Location</h2>
            <p className="text-muted-foreground mb-6">
              Currently located in the vibrant Thamel district, our store serves as a cultural hub where tradition meets contemporary fashion. Our new location allows us to reach a broader audience while maintaining our commitment to quality and authenticity.
            </p>

            <h2 className="text-2xl text-green-800 font-semibold mb-4">Our Products</h2>
            <p className="text-muted-foreground mb-6">
              We offer a carefully curated selection of clothing and accessories, each piece telling a unique story of Nepali craftsmanship. From traditional designs to modern interpretations, our collection represents the rich cultural heritage of Nepal.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AboutUsPage;