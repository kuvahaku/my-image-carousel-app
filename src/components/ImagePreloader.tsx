import React, { useState, useEffect, useCallback } from "react";
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
  const [isPreComplete, setIsPreComplete] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const totalCount = media.length;

  const setLoadedCountCallback = useCallback(
    (src: string, index: number) => {
      setLoadedCount((prevCount) => {
        console.log(`Loaded ${index + 1}/${totalCount}: ${src}`);
        return prevCount + 1;
      });
    },
    [totalCount],
  );

  useEffect(() => {
    console.log("ImagePreloader effect running");
    console.log("Total media items:", totalCount);
    console.log("User Agent:", navigator.userAgent);

    let isMounted = true;

    const preloadMedia = async () => {
      const loadMediaWithTimeout = (src: string, index: number) => {
        return new Promise((resolve) => {
          const timeout = setTimeout(() => {
            console.warn(`Loading timed out for ${src}`);
            resolve(null);
          }, 30000); // 30 seconds timeout

          if (src.endsWith(".mp4") || src.endsWith(".webm")) {
            const video = document.createElement("video");
            video.preload = "metadata";

            video.onloadedmetadata = () => {
              if (isMounted) {
                clearTimeout(timeout);
                setLoadedCountCallback(src, index);
                resolve(null);
              }
            };

            video.onerror = (e) => {
              console.error(
                `Error loading video ${index + 1}/${totalCount}: ${src}`,
                e,
              );
              clearTimeout(timeout);
              resolve(null);
            };

            video.src = src;
          } else {
            const img = new Image();
            img.onload = () => {
              if (isMounted) {
                clearTimeout(timeout);
                setLoadedCountCallback(src, index);
                resolve(null);
              }
            };
            img.onerror = (e) => {
              console.error(
                `Error loading image ${index + 1}/${totalCount}: ${src}`,
                e,
              );
              clearTimeout(timeout);
              resolve(null);
            };
            img.src = src;
          }
        });
      };

      const promises = media.map((src, index) =>
        loadMediaWithTimeout(src, index),
      );

      try {
        await Promise.all(promises);
        console.log("All media preloaded");
        if (isMounted) {
          setIsPreComplete(true);
        }
      } catch (error) {
        console.error("Error during media preloading:", error);
      }
    };

    preloadMedia();

    return () => {
      isMounted = false;
      console.log("ImagePreloader cleanup");
    };
  }, [media, totalCount, setLoadedCountCallback]);

  useEffect(() => {
    if (isPreComplete) {
      const finalCheckTimeout = setTimeout(() => {
        const allItemsLoaded = loadedCount === totalCount;

        if (allItemsLoaded) {
          setIsComplete(true);
          onComplete();
          console.log("onComplete callback executed");
        } else {
          console.warn("Not all items loaded after pre-completion");
          // Handle this case as needed
        }
      }, 500); // 500ms delay

      return () => clearTimeout(finalCheckTimeout);
    }
  }, [isPreComplete, loadedCount, totalCount, onComplete]);

  const progress = (loadedCount / totalCount) * 100;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 text-white">
      <div className="text-center">
        <h2 className="text-2xl mb-4 font-mono">
          {isComplete
            ? "Loading Complete!"
            : isPreComplete
              ? "Finalizing... (◕‿◕✿)"
              : "Loading (⌐■_■)"}
        </h2>
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
