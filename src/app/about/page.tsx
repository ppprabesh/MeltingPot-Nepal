import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const AboutUsPage = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl text-green-800 font-bold mb-8">About Us</h1>
        
        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="text-2xl text-green-800 font-semibold mb-4">Our Story</h2>
            <p className="text-muted-foreground mb-6">
              Founded in 2020, we set out to revolutionize sustainable fashion. Our commitment to eco-friendly materials and ethical manufacturing has made us a leader in conscious clothing.
            </p>
            
            <h2 className="text-2xl text-green-800 font-semibold mb-4">Our Mission</h2>
            <p className="text-muted-foreground mb-6">
              We strive to create high-quality, sustainable clothing while minimizing our environmental impact. Every piece is crafted with care for both our customers and the planet.
            </p>

            <h2 className="text-2xl text-green-800 font-semibold mb-4">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-green-800">Sustainability</CardTitle>
                </CardHeader>
                <CardContent>
                  Using eco-friendly materials and renewable resources
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-green-800">Quality</CardTitle>
                </CardHeader>
                <CardContent>
                  Crafting durable products that last longer
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-green-800">Community</CardTitle>
                </CardHeader>
                <CardContent>
                  Supporting local artisans and ethical practices
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};


export default AboutUsPage;