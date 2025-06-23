import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollSmoother } from "gsap/ScrollSmoother";

gsap.registerPlugin(ScrollTrigger, TextPlugin, ScrollToPlugin, ScrollSmoother);

export const customEase = {
  smooth: "power2.inOut",
  smoothOut: "power2.out",
  smoothIn: "power2.in",
  elastic: "elastic.out(1, 0.5)",
  elasticIn: "elastic.in(1, 0.5)",
  bounce: "bounce.out",
  expo: "expo.out",
  expoIn: "expo.in",
  spring: "back.out(1.2)",
  springIn: "back.in(1.2)",
  circ: "circ.out",
  sine: "sine.inOut",
};

// Scroll-triggered counter animation
export const animateCounter = (
  element: HTMLElement,
  target: number,
  duration: number = 2000,
  suffix: string = ""
) => {
  const start = 0;
  const increment = target / (duration / 16); // 60 FPS
  let current = start;

  const updateCounter = () => {
    current += increment;
    if (current < target) {
      element.textContent = Math.floor(current).toString() + suffix;
      requestAnimationFrame(updateCounter);
    } else {
      element.textContent = target.toString() + suffix;
    }
  };

  updateCounter();
};

// Scroll observer for triggering animations
export const createScrollObserver = (
  elements: NodeListOf<Element>,
  callback: (entry: IntersectionObserverEntry) => void,
  options?: IntersectionObserverInit
) => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        callback(entry);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.5,
    ...options
  });

  elements.forEach(el => observer.observe(el));

  return observer;
};