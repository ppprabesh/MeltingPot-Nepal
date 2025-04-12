import { ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "@/hooks/use-toast";

export default function HomePageHero (){
  return(
    <>
    {/* Hero Section with Background Image */}
    <div 
        className="relative h-screen flex items-center justify-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Welcome to Melting Pot
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
            Experience the perfect blend of flavors and cultures in every dish
          </p>
          <Button 
            size="lg" 
            className="bg-white text-black hover:bg-white/90"
            onClick={() => toast({
              title: "Coming Soon!",
              description: "Our menu will be available soon.",
            })}
          >
            View Menu <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>

    </>
  )
}