'use client';

import DevineGrowthSection from "@/components/DevineGrowthSection";
import FeaturesSection from "@/components/FeaturesSection";
// import HomePageHero from "@/components/HomePageHero";
import HomePageHero1 from "@/components/HompageHero1";
import TestimonialSlider from "@/components/TestimonialSlider";
import WeSellSlider from "@/components/WeSell";

// import ImageCarouselSection from "@/components/ImageCarouselSection";


export default function Home() {
  
 
  return (
    <div className="bg-gray-50">

   {/* <ImageCarouselSection/> */}
      <HomePageHero1/>
      {/* <HomePageHero/> */}
      <WeSellSlider/>
      <FeaturesSection/>
      <DevineGrowthSection/>
      <TestimonialSlider/>


      
    </div>
  );
}
