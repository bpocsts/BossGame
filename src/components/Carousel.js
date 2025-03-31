import React, { useCallback, useEffect, useRef } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import '../style/Carousel.css';


const TWEEN_FACTOR_BASE = 0.84;

const numberWithinRange = (number, min, max) =>
  Math.min(Math.max(number, min), max);

const EmblaCarousel = (props) => {
  const { slides, options } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel(options);
  const tweenFactor = useRef(0);
  const autoScrollRef = useRef(null); // Reference สำหรับการควบคุม auto-scroll

  const setTweenFactor = useCallback((emblaApi) => {
    tweenFactor.current = TWEEN_FACTOR_BASE * emblaApi.scrollSnapList().length;
  }, []);

  const tweenOpacity = useCallback((emblaApi, eventName) => {
    const engine = emblaApi.internalEngine();
    const scrollProgress = emblaApi.scrollProgress();
    const slidesInView = emblaApi.slidesInView();
    const isScrollEvent = eventName === 'scroll';

    emblaApi.scrollSnapList().forEach((scrollSnap, snapIndex) => {
      let diffToTarget = scrollSnap - scrollProgress;
      const slidesInSnap = engine.slideRegistry[snapIndex];

      slidesInSnap.forEach((slideIndex) => {
        if (isScrollEvent && !slidesInView.includes(slideIndex)) return;

        if (engine.options.loop) {
          engine.slideLooper.loopPoints.forEach((loopItem) => {
            const target = loopItem.target();

            if (slideIndex === loopItem.index && target !== 0) {
              const sign = Math.sign(target);

              if (sign === -1) {
                diffToTarget = scrollSnap - (1 + scrollProgress);
              }
              if (sign === 1) {
                diffToTarget = scrollSnap + (1 - scrollProgress);
              }
            }
          });
        }

        const tweenValue = 1 - Math.abs(diffToTarget * tweenFactor.current);
        const opacity = numberWithinRange(tweenValue, 0, 1).toString();
        emblaApi.slideNodes()[slideIndex].style.opacity = opacity;
      });
    });
  }, []);

  // ฟังก์ชันเริ่ม Auto-scroll
  const startAutoScroll = useCallback(() => {
    autoScrollRef.current = setInterval(() => {
      if (emblaApi) {
        emblaApi.scrollNext(); // เลื่อนภาพไปข้างหน้า
      }
    }, 3000); // เลื่อนทุก 3 วินาที
  }, [emblaApi]);

  // ฟังก์ชันหยุด Auto-scroll
  const stopAutoScroll = useCallback(() => {
    if (autoScrollRef.current) {
      clearInterval(autoScrollRef.current); // หยุดเลื่อน
      autoScrollRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    setTweenFactor(emblaApi);
    tweenOpacity(emblaApi);

    emblaApi
      .on('reInit', setTweenFactor)
      .on('reInit', tweenOpacity)
      .on('scroll', tweenOpacity)
      .on('slideFocus', tweenOpacity);

    // เริ่ม auto-scroll เมื่อ mount
    startAutoScroll();

    // หยุด auto-scroll เมื่อกดเมาส์ และเริ่มใหม่เมื่อปล่อย
    const viewport = emblaApi.containerNode(); // อ้างอิง viewport ของ Embla
    viewport.addEventListener('mousedown', stopAutoScroll);
    viewport.addEventListener('mouseup', startAutoScroll);

    return () => {
      stopAutoScroll(); // เคลียร์ auto-scroll
      viewport.removeEventListener('mousedown', stopAutoScroll);
      viewport.removeEventListener('mouseup', startAutoScroll);
    };
  }, [emblaApi, setTweenFactor, tweenOpacity, startAutoScroll, stopAutoScroll]);

  return (
    <div className="embla">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {slides.map((src, index) => (
            <div className="embla__slide" key={index}>
              <img
                className="embla__slide__img"
                src={src}
                alt={`Slide ${index + 1}`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmblaCarousel;