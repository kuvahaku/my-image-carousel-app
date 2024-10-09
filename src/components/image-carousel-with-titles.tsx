"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  motion,
  AnimatePresence,
  useSpring,
  useMotionValue,
  useTransform,
  animate,
} from "framer-motion";
import ImagePreloader from "./ImagePreloader";

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const images = [
  { src: "/images/januar.png", title: "٩(◕‿◕｡)۶" },
  { src: "/images/januar-1.png", title: "٩(◕‿◕｡)۶" },
  {
    group: [
      { src: "/images/januar-1-1.png", zIndex: 0 },
      { src: "/images/januar-1-2.png", zIndex: 2 },
    ],
  },
  { src: "/images/januar-2.png", title: "٩(◕‿◕｡)۶" },
  {
    group: [
      { src: "/images/januar-3-1.png", zIndex: 0 },
      { src: "/images/januar-3-2.png", zIndex: 2 },
    ],
  },
  { src: "/images/image2.gif", title: "Special Sale" },
  {
    group: [
      { src: "/images/februar-1-1.png", zIndex: 0 },
      { src: "/images/februar-1-2.png", zIndex: 2 },
    ],
  },
  { src: "/images/februar-1.png", title: "٩(̾●̮̮̃̾•̃̾)۶" },
  { src: "/images/februar-2.png", title: "" },
  {
    group: [
      { src: "/images/februar-3-1.png", zIndex: 0 },
      { src: "/images/februar-3-2.png", zIndex: 2 },
    ],
  },
  { src: "/images/marz.png", title: "۶" },
  { src: "/images/marz-1.gif" },
  { src: "/images/marz-2.gif" },
  {
    group: [
      { src: "/images/marz-3-1.jpg", zIndex: 0 },
      { src: "/images/marz-3-2.png", zIndex: 2 },
    ],
  },
  { src: "/images/april.png", title: "" },
  { src: "/images/april-1.gif", title: "" },
  { src: "/images/april-2.gif", title: "" },
  {
    group: [
      { src: "/images/april-3-1.jpg", zIndex: 0 },
      { src: "/images/april-3-2.png", zIndex: 2 },
    ],
  },
  { src: "/images/mai.png", title: "" },
  {
    group: [
      { src: "/images/mai-3-1.png", zIndex: 0 },
      { src: "/images/mai-3-2.png", zIndex: 2 },
    ],
  },
  {
    group: [
      { src: "/images/mai-4-1.png", zIndex: 0 },
      { src: "/images/mai-4-2.png", zIndex: 2 },
    ],
  },
  { src: "/images/juni.png", title: "" },
  { src: "/images/juni-1.jpg", title: "" },

  {
    group: [
      { src: "/images/juni-1-1.png", zIndex: 0 },
      { src: "/images/juni-1-2.png", zIndex: 2 },
    ],
  },

  { src: "/images/juli.png", title: "" },

  {
    group: [
      { src: "/images/juli-4-1.png", zIndex: 0 },
      { src: "/images/juli-4-2.png", zIndex: 2 },
    ],
  },
  {
    group: [
      { src: "/images/juli-3-1.jpg", zIndex: 0 },
      { src: "/images/juli-3-2.png", zIndex: 2 },
    ],
  },
  //{ src: "/images/august.png", title: "" },
  {
    group: [
      { src: "/images/august-b.png", zIndex: 0 },
      { src: "/images/august-a.png", zIndex: 2 },
    ],
  },

  { src: "/images/august-2.gif", title: "" },
  { src: "/images/pinball.mp4", title: "" },
  { src: "/images/august-1.jpg", title: "" },
  {
    group: [
      { src: "/images/september-2-1.jpg", zIndex: 0 },
      { src: "/images/september-2-2.png", zIndex: 2 },
    ],
  },

  { src: "/images/september.png", title: "" },

  {
    group: [
      { src: "/images/september-1-1.jpg", zIndex: 0 },
      { src: "/images/september-1-2.png", zIndex: 2 },
    ],
  },

  {
    group: [
      { src: "/images/september-3-1.jpg", zIndex: 0 },
      { src: "/images/september-3-2.png", zIndex: 2 },
    ],
  },
];

function Star() {
  const x = Math.random() * 100;
  const y = Math.random() * 100;
  const size = Math.random() * 2 + 1;

  return (
    <motion.div
      className="absolute bg-white rounded-full"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: `${size}px`,
        height: `${size}px`,
      }}
      animate={{
        opacity: [0.2, 1, 0.2],
      }}
      transition={{
        duration: Math.random() * 3 + 2,
        repeat: Infinity,
        repeatType: "reverse",
      }}
    />
  );
}

const StarryBackground = React.memo(() => {
  return (
    <div className="absolute inset-0 overflow-hidden z-0">
      {Array.from({ length: 100 }).map((_, index) => (
        <Star key={index} />
      ))}
    </div>
  );
});

StarryBackground.displayName = "StarryBackground";

export default function ImageCarouselWithTitles() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const autoX = useMotionValue(0);
  const autoY = useMotionValue(0);

  const combinedX = useTransform(
    [autoX, mouseX],
    ([ax, mx]: [number, number]) => clamp(ax * 0.2 + mx * 0.8, -50, 50),
  );
  const combinedY = useTransform(
    [autoY, mouseY],
    ([ay, my]: [number, number]) => clamp(ay * 0.2 + my * 0.8, -50, 50),
  );

  const imageTransforms = images.map((image) => {
    const baseRotateY = useTransform(combinedX, [-50, 50], [-5, 5]);
    const baseRotateX = useTransform(combinedY, [-50, 50], [5, -5]);
    const baseScale = useTransform(combinedX, [-50, 50], [0.98, 1.02]);

    if ("group" in image && image.group) {
      return {
        depths: image.group.map((_, index) =>
          useTransform(
            combinedX,
            [-50, 50],
            [
              (image.group.length - index) * 5,
              (image.group.length - index) * -5,
            ],
          ),
        ),
        rotateY: baseRotateY,
        rotateX: baseRotateX,
        scale: baseScale,
      };
    } else {
      return {
        depth: useTransform(combinedX, [-50, 50], [5, -5]),
        rotateY: baseRotateY,
        rotateX: baseRotateX,
        scale: baseScale,
      };
    }
  });

  const navigateForward = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  }, []);

  const navigateBackward = useCallback(() => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length,
    );
  }, []);

  const handleClick = useCallback(() => {
    navigateForward();
  }, [navigateForward]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        navigateForward();
      } else if (event.key === "ArrowLeft") {
        navigateBackward();
      }
    },
    [navigateForward, navigateBackward],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const container = containerRef.current;
      if (container) {
        const { left, top, width, height } = container.getBoundingClientRect();
        const x = ((event.clientX - left) / width - 0.5) * 100;
        const y = ((event.clientY - top) / height - 0.5) * 100;
        mouseX.set(x);
        mouseY.set(y);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [mouseX, mouseY]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleMouseMove = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        animate(mouseX, 0, {
          duration: 1,
          ease: "easeOut",
        });
        animate(mouseY, 0, {
          duration: 1,
          ease: "easeOut",
        });
      }, 2000); // Start resetting after 2 seconds of no movement
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearTimeout(timeoutId);
    };
  }, [mouseX, mouseY]);

  useEffect(() => {
    const interval = setInterval(() => {
      const time = Date.now() / 8000; // Slower movement
      autoX.set(Math.sin(time) * 100); // Reduced amplitude
      autoY.set(Math.cos(time) * 50); // Reduced amplitude
    }, 16);

    return () => clearInterval(interval);
  }, [autoX, autoY]);

  const springConfig = { damping: 15, stiffness: 50 };
  const rotateX = useSpring(combinedY, springConfig);
  const rotateY = useSpring(combinedX, springConfig);

  const nextIndex = (currentIndex + 1) % images.length;

  const renderImage = (image: any, index: number) => {
    const transforms = imageTransforms[index];

    if ("group" in image && image.group) {
      return (
        <div
          className="relative w-full h-[90vh] flex items-center justify-center"
          style={{ perspective: "1500px" }}
        >
          {image.group.map((groupImage: any, groupIndex: number) => {
            const zIndex = groupImage.zIndex;
            const isVideo = groupImage.src.endsWith(".mp4");

            return (
              <motion.div
                key={groupIndex}
                className="absolute w-full h-full flex items-center justify-center"
                style={{
                  zIndex: zIndex * 10,
                  y: transforms.depths ? transforms.depths[groupIndex] : 0,
                  rotateY: transforms.rotateY,
                  rotateX: transforms.rotateX,
                  scale: transforms.scale,
                }}
                initial={{ opacity: 0, z: -200 * (groupIndex + 1) }}
                animate={{ opacity: 1, z: zIndex * 100 }}
                exit={{ opacity: 0, z: 200 * (groupIndex + 1) }}
                transition={{ duration: 0.8, delay: groupIndex * 0.2 }}
              >
                {isVideo ? (
                  <motion.video
                    key={groupImage.src}
                    src={groupImage.src}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-auto h-auto max-w-full max-h-full object-contain rounded-4xl"
                    style={{
                      filter: `drop-shadow(0 ${10 + zIndex * 5}px ${20 + zIndex * 10}px rgba(0,0,0,0.4))`,
                    }}
                  />
                ) : (
                  <motion.img
                    src={groupImage.src}
                    alt={`${image.title || ""} - ${groupIndex + 1}`}
                    className="w-auto h-auto max-w-full max-h-full object-contain rounded-4xl"
                    style={{
                      filter: `drop-shadow(0 ${10 + zIndex * 5}px ${20 + zIndex * 10}px rgba(0,0,0,0.4))`,
                    }}
                  />
                )}
              </motion.div>
            );
          })}
        </div>
      );
    } else {
      const isVideo = image.src.endsWith(".mp4");
      return (
        <motion.div
          className="relative w-full h-[90vh] flex items-center justify-center"
          style={{ perspective: "1500px" }}
        >
          {isVideo ? (
            <motion.video
              key={image.src}
              src={image.src}
              autoPlay
              loop
              muted
              playsInline
              className="w-auto h-auto max-w-full max-h-full object-contain rounded-4xl"
              style={{
                y: transforms.depth,
                rotateY: transforms.rotateY,
                rotateX: transforms.rotateX,
                scale: transforms.scale,
              }}
              initial={{ opacity: 0, z: -200 }}
              animate={{ opacity: 1, z: 0 }}
              exit={{ opacity: 0, z: 200 }}
              transition={{ duration: 0.8 }}
            />
          ) : (
            <motion.img
              src={image.src}
              alt={image.title || ""}
              className="w-auto h-auto max-w-full max-h-full object-contain rounded-4xl"
              style={{
                y: transforms.depth,
                rotateY: transforms.rotateY,
                rotateX: transforms.rotateX,
                scale: transforms.scale,
              }}
              initial={{ opacity: 0, z: -200 }}
              animate={{ opacity: 1, z: 0 }}
              exit={{ opacity: 0, z: 200 }}
              transition={{ duration: 0.8 }}
            />
          )}
        </motion.div>
      );
    }
  };

  const allImageUrls = images.flatMap((image) =>
    "group" in image && image.group
      ? image.group.map((g) => g.src)
      : [image.src],
  );

  const handleImagesLoaded = useCallback(() => {
    console.log("All images loaded, carousel ready");
    setImagesLoaded(true);
  }, []);

  if (!imagesLoaded) {
    console.log("Preloading images...");
    return (
      <ImagePreloader images={allImageUrls} onComplete={handleImagesLoaded} />
    );
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-screen flex flex-col items-center justify-center bg-gray-900 cursor-pointer overflow-hidden relative"
      onClick={handleClick}
      style={{ perspective: "1500px" }}
      tabIndex={0}
    >
      <StarryBackground />

      <AnimatePresence initial={false}>
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 0.5, z: -800 }}
          animate={{ opacity: 1, scale: 1, z: 0 }}
          exit={{ opacity: 0, scale: 1.5, z: 250 }}
          transition={{ duration: 0.8, ease: [0.645, 0.045, 0.355, 1] }}
          className="flex flex-col items-center justify-center relative z-10"
          style={{
            transformStyle: "preserve-3d",
            position: "absolute",
            width: "calc(100% - 40px)",
            height: "calc(100% - 40px)",
            maxWidth: "1200px",
            maxHeight: "80vh",
            rotateX,
            rotateY,
          }}
        >
          {renderImage(images[currentIndex], currentIndex)}
        </motion.div>
      </AnimatePresence>

      {/* Preload next image */}
      <div className="hidden">
        {"group" in images[nextIndex] && images[nextIndex].group ? (
          images[nextIndex].group.map((groupImage: any, index: number) => (
            <Image
              key={index}
              src={groupImage.src}
              alt={`Preload Group Image ${index + 1}`}
              width={1}
              height={1}
            />
          ))
        ) : (
          <Image
            src={(images[nextIndex] as { src: string }).src}
            alt={(images[nextIndex] as { title?: string }).title || ""}
            width={1}
            height={1}
          />
        )}
      </div>
    </div>
  );
}
