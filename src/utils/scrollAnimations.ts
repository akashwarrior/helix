import { useScroll, useTransform } from "motion/react";
import { MutableRefObject } from "react";

export const useParallaxScroll = (
  ref: MutableRefObject<HTMLElement | null>,
  offset: ["start" | "center" | "end", "start" | "center" | "end"] = ["start", "end"]
) => {
  const { scrollYProgress } = useScroll({
    target: ref,
    offset,
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const x = useTransform(scrollYProgress, [0, 1], [-100, 100]);

  return { scrollYProgress, y, opacity, scale, rotate, x };
};


export const useSectionReveal = (ref: MutableRefObject<HTMLElement | null>) => {
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });

  const y = useTransform(scrollYProgress, [0, 0.5], [100, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.95, 1]);

  return { scrollYProgress, y, opacity, scale };
};

export const useCardScroll = (
  ref: MutableRefObject<HTMLElement | null>,
  index: number = 0
) => {
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });

  const y = useTransform(
    scrollYProgress,
    [0, 0.5 + index * 0.1],
    [150 + index * 20, 0]
  );
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.3 + index * 0.05],
    [0, 1]
  );
  const rotate = useTransform(
    scrollYProgress,
    [0, 0.5],
    [5 + index * 2, 0]
  );

  return { scrollYProgress, y, opacity, rotate };
};