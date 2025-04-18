import Image from "next/image";

export default function DevineGrowthSection() {
  return (
    
      <div className="mx-auto flex flex-col justify-center">
        {/* Header Section */}
        <div className="mb-16 flex p-2 md:p-0 flex-col justify-center items-center  mt-[85px] text-center lg:text-left">
          <h1 className="text-2xl font-bold text-green-600  text-3xl lg:text-$xl">
            Driving 
            <span> Growth</span>,
             And{" "}
            <span>Excellence</span>
          </h1>
          <p className="mt-2 text-md lg:text-lg text-gray-600">
            We believe in pushing boundaries while staying true to our values,
            creating meaningful solutions.
          </p>
        </div>
        {/* Main Content Area */}
        <div className="flex justify-center">
          <div className="grid max-w-[1121px] grid-cols-12 justify-center gap-4 md:gap-8 lg:gap-6">
            {/* Left Decorative Cards */}
            <div className="col-span-12 hidden items-center justify-end md:col-span-2 md:flex">
              <div className="relative aspect-[177/230] w-full max-w-[177px]">
                <Image
                  src="/images/shop1.jpg"
                  alt="Seamless Experience"
                  fill
                  className="rounded-[20px] object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center rounded-[20px] bg-black bg-opacity-50 p-4 text-green-600 text-xl text-white">
                  100% Made in Nepal
                </div>
              </div>
            </div>
            {/* Center Cards */}
            <div className="col-span-12 flex flex-col gap-8 md:col-span-8">
              {/* Creative Collaborative Working */}
              <div className="flex flex-col items-end gap-4 md:flex-row md:gap-8">
                <div className="aspect-auto w-full overflow-hidden rounded-[20px] bg-white p-3 shadow-[0px_3px_32px_rgba(0,0,0,0.06)] md:aspect-[568/369] md:w-3/4">
                  <div className="flex h-full flex-col md:flex-row">
                    <div className="relative order-2 aspect-square h-auto md:order-none md:h-full md:w-1/2">
                      <Image
                        src="/images/brands/jujuwears.png"
                        alt="Collaborative working"
                        fill
                        className="rounded-[20px] object-contain"
                      />
                    </div>
                    <div className="order-1 flex h-full w-full flex-col justify-center p-4 md:order-none md:h-full md:w-1/2 md:p-2">
                      <h3 className="text-left text-[20px] font-bold text-green-600 md:text-left md:text-[16px] lg:text-[20px]">
                        Affordable and Sustainable
                      </h3>
                      <p className="overflow-hidden text-[14px] font-normal leading-[20px] text-[#020E1A] lg:text-[16px]">
                        We believe in providing affordable and sustainable products to our customers. We have been serving our customers for 10 years and we are still growing. We are a team of 100+ people and we aim to provide the best products to our customers.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="relative hidden aspect-square w-full md:block md:w-1/4">
                  <Image
                    src="/images/tmp-dark.png"
                    alt="Innovative Creation"
                    fill
                    className="rounded-[20px] object-contain"
                  />
                  <div className="absolute inset-0 flex items-center justify-center rounded-[20px] bg-black bg-opacity-50 p-4 text-center text-xl text-white">
                   Made Locally for Local People
                  </div>
                </div>
              </div>
              {/* Excellence Through Growth */}
              <div className="flex flex-col items-start gap-4 md:flex-row md:gap-8">
                <div className="relative hidden aspect-square w-full md:block md:w-1/4">
                  <Image
                    src="/images/tmp-dark.png"
                    alt="melting pot"
                    fill
                    className="rounded-[20px] object-contain"
                  />
                  <div className="absolute inset-0 flex items-center justify-center rounded-[20px] bg-black bg-opacity-50 p-4 text-center text-xl text-white">
                    Quality over Trend
                  </div>
                </div>
                <div className="aspect-auto w-full overflow-hidden rounded-[20px] bg-white p-3 shadow-[0px_3px_32px_rgba(0,0,0,0.06)] md:aspect-[568/369] md:w-3/4">
                  <div className="flex h-full flex-col md:flex-row">
                    <div className="relative aspect-square h-auto md:h-full md:w-1/2">
                      <Image
                        src="/images/brands/karuna.png"
                        alt="Excellence through growth"
                        fill
                        className="rounded-[20px] object-contain"
                      />
                    </div>
                    <div className="flex h-full w-full flex-col justify-center p-4 md:h-full md:w-1/2 md:p-2">
                      <h3 className="mb-2 text-left text-[20px] font-bold text-green-600 md:text-left md:text-[16px] lg:text-[20px]">
                       Originality and Creativity
                      </h3>
                      <p className="overflow-hidden text-[14px] font-normal leading-[20px] tracking-[0%] text-[#020E1A] lg:text-[16px]">
                       We have a team of designer who are passionate about their work and design the prints reflecting the culture of Nepal. And they are hand printed so that the quality is not compromised.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Right Decorative Cards */}
            <div className="col-span-12 hidden items-center justify-center md:col-span-2 md:flex">
              <div className="relative aspect-[177/230] w-full max-w-[177px]">
                <Image
                  src="/images/shop1.jpg"
                  alt="Scalable Technology"
                  fill
                  className="rounded-[20px] object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center rounded-[20px] bg-black bg-opacity-50 p-4 text-center text-xl text-white">
                  Scalable Technology
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    
  );
}
