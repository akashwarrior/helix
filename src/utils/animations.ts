import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollTrigger, TextPlugin, ScrollToPlugin);

export const defaultScrollTrigger = {
  start: "top 80%",
  end: "bottom 20%",
  toggleActions: "play pause resume reverse",
  fastScrollEnd: true,
  preventOverlaps: true,
};

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

// Scroll to section with easing
export const scrollToSection = (
  target: string,
  options?: { offsetY?: number },
) => {
  const element = document.querySelector(target);
  if (!element) return;

  const defaults = {
    duration: 1.8,
    ease: customEase.smoothOut,
    offsetY: options?.offsetY || 80,
  };

  const targetPosition =
    element.getBoundingClientRect().top + window.pageYOffset - defaults.offsetY;

  gsap.to(window, {
    scrollTo: {
      y: targetPosition,
      autoKill: false,
    },
    duration: defaults.duration,
    ease: defaults.ease,
  });
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