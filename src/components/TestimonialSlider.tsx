"use client"


import type React from "react"
import { useRef, useState } from "react"
import Slider from "react-slick"
import "slick-carousel/slick/slick-theme.css"
import "slick-carousel/slick/slick.css"
import { renderStars } from "./RenderStars"
import { Icon } from "@iconify/react/dist/iconify.js"


// import { Star } from "lucide-react"

// Simple classNames utility to replace cn from shadcn
function classNames(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ")
}

interface Testimonial {
  id: number
  name: string
  rating: number
  quote: string
  
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Brad  Paull",
    rating: 5,
    quote:
      "The tshirts are good quality and different from what you find at a lot of other shops. The staff are great. Attentive but not pushy. Very cool shop.",
    
  },
  {
    id: 2,
    name: "Angela Chea",
    rating: 5,
    quote:
      "Great original designs and higher quality than most stores around. Sizes ran small but we were able to try on.",
   
  },
  {
    id: 3,
    name: "Ken Perfect",
    rating: 4.8,
    quote:
      "Looking for a better quality t shirt than the cheaper street vender ones? Come here, nice unique prints and quality fabric. Brought one for my daughter she should be happy! Friendly staff.",
    
  },
  {
    id: 4,
    name: "Veronika Máté",
    rating: 4.8,
    quote:
      "High quality shirts with unique design. I purchased two shirts made from hemp material, and they look great.",
    
  },
]

const TestimonialSlider = () => {
  const sliderRef = useRef<Slider | null>(null)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [targetSlide, setTargetSlide] = useState(0)

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
    beforeChange: (current: number, next: number) => {
      setIsTransitioning(true)
      setCurrentSlide(current)
      setTargetSlide(next)

      // Reset transition state after animation completes
      setTimeout(() => {
        setIsTransitioning(false)
        setCurrentSlide(next)
      }, 500) // Match this with the slider speed
    },
    customPaging: (i: number) => {
      // Determine if this dot is the current slide, target slide, or neither
      const isActive = i === currentSlide
      const isTarget = isTransitioning && i === targetSlide
      const isInTransition = isTransitioning && (i === currentSlide || i === targetSlide)

      return (
        <div
          className={classNames(
            "transition-all duration-500 mx-1 my-0",
            isActive && !isTransitioning ? "w-2 h-2 bg-brand rounded-full" : "",
            isTarget ? "w-2 h-2 bg-brand rounded-full" : "",
            isInTransition && i === currentSlide ? "w-4 h-1 bg-gray-300 rounded-sm" : "",
            !isActive && !isTarget && !isInTransition ? "w-2 h-2 bg-gray-300 rounded-full" : "",
          )}
        />
      )
    },
    appendDots: (dots: React.ReactNode) => (
      <div>
        <ul className="flex justify-center items-center mt-8"> {dots} </ul>
      </div>
    ),
    dotsClass: "slick-dots custom-dots",
  }

  

  return (
    <div className="py-16 px-4 md:px-8 max-w-7xl mx-auto my-8">
      <div className="text-center mb-12">
        
        <h2 className="text-3xl lg:text-4xl text-green-600 font-bold">What Our Clients Say</h2>
      </div>

      <div className="testimonial-slider">
        <Slider ref={sliderRef} {...settings}>
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="px-4">
              <div className="bg-white  p-6 rounded-[20px] ">
                {renderStars(testimonial.rating)}
                <p className="my-4 text-gray-700 text-sm leading-relaxed">{testimonial.quote}</p>
                <div className="flex items-center mt-4">
              
                  <div className=" flex gap-4">
                  <Icon icon="qlementine-icons:user-16" width="30" className="text-blue-800" height="24" />
                    <h4 className="font-medium text-gray-900">{testimonial.name}</h4>
                   
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  )
}

export default TestimonialSlider

