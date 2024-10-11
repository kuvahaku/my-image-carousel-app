import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface ImagePreloaderProps {
  media: string[];
  onComplete: () => void;
}

const ImagePreloader: React.FC<ImagePreloaderProps> = ({
  media,
  onComplete,
}) => {
  const [loadedCount, setLoadedCount] = useState(0);
  const totalCount = media.length;

  useEffect(() => {
    console.log("Total media items:", totalCount);

    const preloadMedia = async () => {
      const promises = media.map((src, index) => {
        return new Promise((resolve, reject) => {
          if (src.endsWith(".mp4") || src.endsWith(".webm")) {
            const video = document.createElement("video");
            video.onloadeddata = () => {
              setLoadedCount((prevCount) => {
                console.log(`Loaded video ${index + 1}/${totalCount}: ${src}`);
                return prevCount + 1;
              });
              resolve(null);
            };
            video.onerror = (e) => {
              console.error(
                `Error loading video ${index + 1}/${totalCount}: ${src}`,
                e,
              );
              reject(e);
            };
            video.src = src;
          } else {
            const img = new Image();
            img.onload = () => {
              setLoadedCount((prevCount) => {
                console.log(`Loaded image ${index + 1}/${totalCount}: ${src}`);
                return prevCount + 1;
              });
              resolve(null);
            };
            img.onerror = (e) => {
              console.error(
                `Error loading image ${index + 1}/${totalCount}: ${src}`,
                e,
              );
              reject(e);
            };
            img.src = src;
          }
        });
      });

      try {
        await Promise.all(promises);
        console.log("All media loaded");
        onComplete();
      } catch (error) {
        console.error("Error preloading media:", error);
      }
    };

    preloadMedia();
  }, [media, onComplete, totalCount]);

  const progress = (loadedCount / totalCount) * 100;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 text-white">
      <div className="text-center">
        <h2 className="text-2xl mb-4">Loading</h2>
        <div className="w-80 h-4 bg-purple-900 rounded-md overflow-hidden">
          <motion.div
            className="h-full bg-purple-600"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>
    </div>
  );
};

export default ImagePreloader;
