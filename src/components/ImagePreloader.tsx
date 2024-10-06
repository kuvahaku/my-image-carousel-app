"use client";

import React, { useEffect, useState } from "react";

interface PreloaderProps {
  images: string[];
  onComplete: () => void;
}

const ImagePreloader: React.FC<PreloaderProps> = ({ images, onComplete }) => {
  const [loadedCount, setLoadedCount] = useState(0);

  useEffect(() => {
    let loadedImages = 0;
    const totalImages = images.length;

    const preloadImage = (src: string) => {
      return new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = () => {
          loadedImages++;
          setLoadedCount(loadedImages);
          console.log(`Loaded image: ${src}`);
          resolve();
        };
        img.onerror = () => {
          console.error(`Failed to load image: ${src}`);
          reject();
        };
      });
    };

    Promise.all(images.map(preloadImage))
      .then(() => {
        console.log("All images preloaded successfully");
        onComplete();
      })
      .catch(() => {
        console.error("Some images failed to load");
        onComplete(); // Still call onComplete to allow the app to proceed
      });
  }, [images, onComplete]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black text-white z-50">
      <div className="text-center">
        <h2 className="text-2xl mb-4">Loading Images</h2>
        <div className="w-64 h-4 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 transition-all duration-300 ease-out"
            style={{ width: `${(loadedCount / images.length) * 100}%` }}
          ></div>
        </div>
        <p className="mt-2">
          {loadedCount} / {images.length}
        </p>
      </div>
    </div>
  );
};

export default ImagePreloader;
