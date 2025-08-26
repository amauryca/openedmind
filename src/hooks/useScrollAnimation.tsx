import { useEffect } from 'react';

export const useScrollAnimation = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            // Add staggered animation delay for coordinated effects
            setTimeout(() => {
              entry.target.classList.add('animate-fade-in');
              entry.target.classList.remove('opacity-0', 'translate-y-8');
              
              // Add special effects for different element types
              if (entry.target.classList.contains('card-hover')) {
                entry.target.classList.add('hover:scale-105');
              }
              if (entry.target.classList.contains('feature-card')) {
                entry.target.classList.add('animate-slide-up');
              }
            }, index * 100); // Reduced stagger for smoother flow
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -20px 0px',
      }
    );

    // Enhanced scroll reveal with coordinated animations
    const elements = document.querySelectorAll('.scroll-reveal');
    elements.forEach((el) => {
      el.classList.add('opacity-0', 'translate-y-8', 'transition-all', 'duration-700', 'ease-out');
      observer.observe(el);
    });

    // Smooth parallax effect for hero elements
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrolled = window.pageYOffset;
          const parallaxElements = document.querySelectorAll('.parallax-element');
          
          parallaxElements.forEach((element) => {
            const htmlElement = element as HTMLElement;
            const speed = parseFloat(htmlElement.getAttribute('data-speed') || '0.5');
            const yPos = -(scrolled * speed);
            htmlElement.style.transform = `translateY(${yPos}px)`;
          });
          
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      elements.forEach((el) => observer.unobserve(el));
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
};