import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';
import { useNavigate } from 'react-router-dom';
import { heroSlides } from '../data/mockData';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

const HeroSlider = () => {
    const navigate = useNavigate();

    return (
        <div className="w-full relative rounded-2xl overflow-hidden shadow-2xl mb-12">
            <Swiper
                modules={[Autoplay, Pagination, Navigation, EffectFade]}
                spaceBetween={0}
                slidesPerView={1}
                effect="fade"
                autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                }}
                pagination={{
                    clickable: true,
                    dynamicBullets: true,
                }}
                navigation
                loop={true}
                className="w-full h-[300px] md:h-[400px] lg:h-[500px]"
            >
                {heroSlides.map((slide) => (
                    <SwiperSlide key={slide.id}>
                        <div className="relative w-full h-full">
                            <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex items-center">
                                <div className="container mx-auto px-4 md:px-8">
                                    <div className="max-w-xl text-white">
                                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-black mb-4 leading-tight animate-fade-in-up text-slate-700">
                                            {slide.title}
                                        </h1>
                                        <p className="text-lg md:text-xl text-blue-500 mb-8 font-light leading-relaxed animate-fade-in-up delay-100">
                                            {slide.subtitle}
                                        </p>
                                        <button
                                            className="bg-white/10 hover:bg-white text-white hover:text-gray-900 border-2 border-white px-8 py-3 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 backdrop-blur-sm animate-fade-in-up delay-200"
                                            onClick={() => navigate(slide.link)}
                                        >
                                            {slide.buttonText}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default HeroSlider;
