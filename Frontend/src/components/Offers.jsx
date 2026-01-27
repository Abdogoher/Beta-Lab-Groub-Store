import React, { useState, useEffect } from "react";
import { offersAPI } from "../services/api";
import ProductCard from "./ProductCard";

const CountdownTimer = ({ endDate }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const difference = +new Date(endDate) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  const timerComponents = [];

  Object.keys(timeLeft).forEach((interval) => {
    if (!timeLeft[interval] && interval !== "seconds") {
      return;
    }

    timerComponents.push(
      <span
        key={interval}
        className="flex flex-col items-center px-2 py-1 bg-red-50 dark:bg-red-900/20 rounded shadow-sm"
      >
        <span className="text-xl font-bold text-red-600 dark:text-red-400">
          {timeLeft[interval] < 10
            ? `0${timeLeft[interval]}`
            : timeLeft[interval]}
        </span>
        <span className="text-[10px] text-red-400 dark:text-red-500 uppercase font-medium">
          {interval === "days"
            ? "يوم"
            : interval === "hours"
              ? "ساعة"
              : interval === "minutes"
                ? "دقيقة"
                : "ثانية"}
        </span>
      </span>,
    );
  });

  return (
    <div className="flex items-center gap-2">
      {timerComponents.length ? (
        timerComponents
      ) : (
        <span className="text-red-600 font-bold">انتهى العرض!</span>
      )}
    </div>
  );
};

export default function Offers() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOffers = async () => {
      try {
        const response = await offersAPI.getAll();
        // Assuming the response is formatted correctly
        setOffers(response.data || []);
      } catch (error) {
        console.error("Failed to load offers:", error);
      } finally {
        setLoading(false);
      }
    };

    loadOffers();
  }, []);

  return (
    <div className="py-12 px-4" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <div className="text-right mb-10">
          <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
            عروض التوفير الكبرى 🛍️
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            أقوى العروض الحصرية لفترة محدودة. لا تفوت الفرصة!
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-8">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 rounded-2xl h-64 animate-pulse shadow-md"
              ></div>
            ))}
          </div>
        ) : (
          <div className="space-y-8">
            {offers.map((offer) => {
              const imgUrl = offer.image_url.startsWith("http")
                ? offer.image_url
                : `http://localhost:3000${offer.image_url}`;
              return (
                <div
                  key={offer.id}
                  className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-xl border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-300 md:flex"
                >
                  <div className="md:w-1/3 relative h-64 md:h-auto overflow-hidden">
                    <img
                      src={imgUrl}
                      alt={offer.name}
                      className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4 bg-red-600 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                      خصم {offer.discount_percentage}%
                    </div>
                  </div>

                  <div className="md:w-2/3 p-8 flex flex-col justify-between">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        {offer.name}
                      </h3>

                      <div className="flex flex-wrap items-center gap-6 mb-8">
                        <div className="flex flex-col">
                          <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                            السعر الأصلي: {offer.original_price} $
                          </span>
                          <span className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">
                            {offer.discounted_price} $
                          </span>
                        </div>

                        <div className="h-12 w-[1px] bg-gray-200 dark:bg-gray-700 hidden sm:block"></div>

                        <div className="flex flex-col gap-1">
                          <span className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                            ينتهي خلال:
                          </span>
                          <CountdownTimer endDate={offer.end_date} />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <button className="flex-1 max-w-xs bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-xl transition-colors shadow-lg shadow-indigo-200 dark:shadow-none">
                        تسوق الآن
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
            {offers.length === 0 && (
              <div className="text-center py-20 bg-gray-50 dark:bg-gray-800/50 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                <p className="text-gray-500 text-xl font-medium">
                  لا توجد عروض نشطة حالياً. انتظرونا قريباً!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
