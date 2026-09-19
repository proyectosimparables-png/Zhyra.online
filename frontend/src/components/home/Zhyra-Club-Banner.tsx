"use client";

import Link from "next/link";
import { useNightMode } from "@/context/Night-Mode-Context";

const ZhyraOnlineClubBanner = () => {
  const { isNight } = useNightMode();

  return (
    <Link
      href="https://whatsapp.com/channel/0029VbDj59P3mFXzjmRsto3b"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Unite a Zhyra Online Club"
      className="block"
    >
      <div
        className={`relative overflow-hidden py-4 md:py-5 cursor-pointer transition-colors duration-700
          ${isNight ? "bg-[#2b1f3d]" : "bg-[#7b5ca2]"}
        `}
      >
        {/* Texto animado */}
        <div className="whitespace-nowrap animate-marquee">
          <span
            className={`mx-8 text-lg md:text-xl font-serif italic tracking-wide
              ${isNight ? "text-[#f5e9ff]" : "text-white"}
            `}
          >
            ✨ HACE CLICK Y UNITE A #ZHYRA.ONLINECLUB ✨
          </span>
          <span
            className={`mx-8 text-lg md:text-xl font-serif italic tracking-wide
              ${isNight ? "text-[#f5e9ff]" : "text-white"}
            `}
          >
            ✨ HACE CLICK Y UNITE A #ZHYRA.ONLINECLUB ✨
          </span>
        </div>

        {/* animación */}
        <style jsx>{`
          .animate-marquee {
            display: inline-block;
            min-width: 100%;
            animation: marquee 14s linear infinite;
          }

          @keyframes marquee {
            0% {
              transform: translateX(0%);
            }
            100% {
              transform: translateX(-50%);
            }
          }
        `}</style>
      </div>
    </Link>
  );
};

export default ZhyraOnlineClubBanner;
