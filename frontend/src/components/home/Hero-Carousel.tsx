"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const slides = ["/bienvenidaZhyra.jpeg", "/cuotasZhyra.jpeg", "/BasicaZhyra.jpeg"];

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative w-full group overflow-hidden bg-[#0b0b0c]"> {/* Fondo suave opcional para los lados */}
      {/* Contenedor con altura ajustada */}
      {/* h-[60vh] para móvil, h-[500px] o md:h-[60vh] para escritorio para reducir el alto y el zoom */}
      <div className="w-full h-[60vh] md:h-[500px] relative">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={slide}
              alt={`Slide ${index + 1}`}
              fill
              priority={index === 0}
           
              className="object-cover md:object-contain object-center w-full h-full"
            />
            {/* Overlay opcional, puedes comentarlo si prefieres la imagen limpia */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(to top, rgba(206,187,245,0.1), transparent)",
              }}
            />
          </div>
        ))}
      </div>

      {/* Botones de navegación - Asegurar que estén por encima */}
      <Button
        variant="ghost"
        size="icon"
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-[#665ca2]/80 hover:bg-[#7b5ca2] opacity-0 group-hover:opacity-100 transition-opacity z-20"
      >
        <ChevronLeft className="h-6 w-6 text-white" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-[#665ca2]/80 hover:bg-[#7b5ca2] opacity-0 group-hover:opacity-100 transition-opacity z-20"
      >
        <ChevronRight className="h-6 w-6 text-white" />
      </Button>

      {/* Dots - Asegurar que estén por encima */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentSlide
                ? "bg-[#665ca2] w-8"
                : "bg-[#665ca2]/50 hover:bg-[#7b5ca2] w-2"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;