import Image from "next/image";

export default function HomePageHero1() {
  return (
    <>
      {/* Hero Section */}
      <div className="relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-row">
          {/* Text Content - Always on left */}
          <div className="w-full lg:w-1/2 z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="text-left">
                <h1 className="text-2xl tracking-tight font-extrabold text-gray-900 md:text-6xl">
                  <span className="block">Made in Nepal</span>
                  <span className="block text-green-600">Handcrafted with Love</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg md:mt-5 md:text-xl">
                  Discover unique, sustainable, and high-quality products crafted by skilled artisans from Nepal.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-start">
                  <div className="rounded-md shadow">
                    <a
                      href="/clothing"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 md:py-4 md:text-lg md:px-10"
                    >
                      Shop Now
                    </a>
                  </div>
                </div>
              </div>
            </main>
          </div>

          {/* Image - Always on right */}
          <div className="w-full lg:w-1/2 flex justify-center items-center">
            <div className="relative w-[120px] h-[120px]  md:w-[250px] md:h-[250px] lg:w-[300px] lg:h-[300px]">
              <Image
                className="object-cover"
                src="/images/themeltingpotlogo.png"
                alt="Made in Nepal Products"
                fill
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}