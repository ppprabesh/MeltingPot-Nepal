"use client";
import Link from "next/link";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";
import { fadeInAnimationVariant } from "./animations/animations";

export default function Location() {
  const [data, setData] = useState<{ gmapLink: string } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/settings/details`,
        );
        const data = await response.json();
        setData(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const gmapLink = data?.gmapLink;

  return (
    <motion.div
      variants={fadeInAnimationVariant}
      initial="initial"
      whileInView={"animate"}
      viewport={{ once: true }}
      className="flex w-full bg-[#FCFCFC] py-[40px] ">
      <div className="flex w-full flex-col ">
        
          <div className="flex flex-col gap-5">
            <div className="flex flex-col justify-between  md:px-[40px] pb-20">
              <div className="text-[22px] md:text-[32px] font-bold  text-left">
                Find Us On <span className="text-brand">The Map</span>
              </div>
              <div className="mt-[10px] flex  justify-between flex-row items-start md:items-center">
                <div className=" text-[16px] md:text-[20px] font-normal  text-[#5C5C5C] text-left">
                  Follow the navigation route for proper guidance to reach to
                  us.
                </div>

                <Link
                  href={gmapLink || "https://maps.app.goo.gl/w8UVfZrUjN3PEnq8A"}
                  target="_blank"
                  className="mt-2 md:mt-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] lg:text-[14px] font-bold  text-brand">
                      Google Maps
                    </span>
                    <Image src="/images/arrow.png" alt="alt" width={14} height={14} />
                    {/* <ImArrowUpRight2 className="text-brand" size={12} /> */}
                  </div>
                </Link>
              </div>
            </div>
          </div>
        
        <div className="flex w-screen items-center justify-center px-4 md:px-8 lg:px-[120px]">
          <div className="relative h-[562px] w-full">
            <iframe
              className="absolute left-0 top-0 h-full w-full rounded-[20px] border-none"
              src={gmapLink}
              allowFullScreen></iframe>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
