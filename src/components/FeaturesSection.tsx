import { Shirt, Sparkles, Leaf } from "lucide-react";

export default function FeaturesSection (){
  return (
    <>
    {/* Features Section */}
    <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl lg:text-5xl text-green-600 font-bold text-center mb-12">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shirt className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl text-green-600 font-semibold mb-2">Premium Quality</h3>
              <p className="text-gray-600">
              We use high-quality, durable fabrics that feel great and last long.
              </p>
            </div>
            <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles  className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl text-green-600 font-semibold mb-2">Trendy & Timeless</h3>
              <p className="text-gray-600">
              From bold trends to classic essentials, our styles suit every vibe.
              </p>
            </div>
            <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf  className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl text-green-600 font-semibold mb-2"> Ethical & Sustainable</h3>
              <p className="text-gray-600">
              We prioritize sustainability, using eco-friendly materials and ethical production.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}