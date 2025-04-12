"use client"
import Image from "next/image";
import { useEffect, useState } from "react";

export default function ImageCarouselSection () {

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Array of image filenames stored in the public folder
  const images = [
    "/images/meltingpot/final1.png",
    "/images/meltingpot/Flag-South-Korea.jpg",
    "/images/meltingpot/logo.jpg",
    "/images/meltingpot/logoo2-removebg-preview.png",
    "/images/meltingpot/logowithgosaikunda.jpg",
  ];

  // Function to go to the next image
  const nextImage = () => {
    setCurrentImageIndex((prevIndex: number) => (prevIndex + 1) % images.length);
  };

  // Automatically swipe through images every 3 seconds
  useEffect(() => {
    const intervalId = setInterval(nextImage, 5000);
    return () => clearInterval(intervalId); // Clear interval on component unmount
  }, []);



  return (
    <>
    {/* Image Carousel Section */}
    <div className="mt-2  relative">
    <div className="flex  justify-center border-4 items-center w-full overflow-hidden">
      <div className="flex transition-transform duration-500" style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}>
        {images.map((image, index) => (
          <div key={index} className="w-full flex-shrink-0">
            <Image
              src={image}
              alt={`Slide ${index + 1}`}
              width={1200}
              height={800}
              className="object-contain w-full h-[250px] sm:h-[300px] md:h-[400px] lg:h-[500px] xl:h-[600px]"
            />
          </div>
        ))}
      </div>
    </div>
  </div>
    </>
  )
}