import { useEffect, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FlashSaleCard } from "@/components/common/FlashSaleCard";
import { HERO_FOCUS_CLASS, HERO_HEIGHT_CLASS, HERO_MOBILE_MEDIA } from "@/constants/storefront";
import type { FlashSale, HeroAlign, HeroSettings, HeroSlide, HeroVertical } from "@/types/storefront";
import { cn } from "@/utils/cn";
import { isExternalUrl, padTwo } from "@/utils/format";

const ALIGN_CLASS: Record<HeroAlign, string> = {
  left: "items-start text-left mr-auto",
  center: "items-center text-center mx-auto",
  right: "items-end text-right ml-auto",
};
// Bottom leaves room for the slide controls and the vehicle selector overlap.
const VERTICAL_CLASS: Record<HeroVertical, string> = {
  top: "items-start pt-28 lg:pt-36",
  center: "items-center",
  bottom: "items-end pb-40",
};

function SlideLink({ url, className, children }: { url: string; className?: string; children: React.ReactNode }) {
  return isExternalUrl(url) ? (
    <a href={url} className={className}>
      {children}
    </a>
  ) : (
    <Link to={url || "/shop"} className={className}>
      {children}
    </Link>
  );
}

interface HeroCarouselProps {
  slides: HeroSlide[];
  settings: HeroSettings;
  // Live sale, shown as a floating card on wide screens when enabled.
  sale: FlashSale | null;
}

// Dashboard-managed slides, Home falls back to the static Hero.
export function HeroCarousel({ slides, settings, sale }: HeroCarouselProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = slides.length;
  const current = index % count;
  const slide = slides[current];
  const dark = slide.text_tone === "dark";
  const autoplay = settings.autoplay && count > 1;
  const intervalMs = settings.interval_seconds * 1000;

  // Depends on index so a manual step restarts the autoplay timer.
  useEffect(() => {
    if (!autoplay || paused) return;
    const id = window.setTimeout(() => setIndex((i) => (i + 1) % count), intervalMs);
    return () => window.clearTimeout(id);
  }, [autoplay, count, index, paused, intervalMs]);

  const step = (delta: number) => setIndex((current + delta + count) % count);
  const arrowClass = cn(
    "h-11 w-11 backdrop-blur-sm hover:border-accent hover:bg-accent hover:text-accent-fg",
    dark ? "border-media-ink/25 bg-on-media/40 text-media-ink" : "border-on-media/25 bg-scrim/30 text-on-media",
  );

  return (
    <section
      id="home"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className={cn("relative flex overflow-hidden bg-scrim lg:pt-16", HERO_HEIGHT_CLASS[settings.height], VERTICAL_CLASS[slide.vertical])}
    >
      {slides.map((s, i) => (
        <div
          key={s._id}
          aria-hidden={i !== current}
          className={cn("absolute inset-0 z-0 transition-opacity duration-1000", i === current ? "opacity-100" : "opacity-0")}
        >
          <picture>
            {s.mobile_image_url && <source media={HERO_MOBILE_MEDIA} srcSet={s.mobile_image_url} />}
            <img
              src={s.image_url}
              alt=""
              className={cn("h-full w-full object-cover", HERO_FOCUS_CLASS[s.image_focus], i === current && "animate-ken-burns")}
              loading={i === 0 ? "eager" : "lazy"}
            />
          </picture>
          {/* Dark text gets a light wash instead of a dark scrim. */}
          <div className={cn("absolute inset-0", s.text_tone === "dark" ? "bg-on-media" : "bg-scrim")} style={{ opacity: s.overlay / 100 }} />
        </div>
      ))}
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-bg via-transparent to-transparent" />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl items-center gap-10 px-4 sm:px-6 lg:px-8">
        <div key={slide._id} className={cn("flex max-w-2xl flex-1 animate-fade-up flex-col", ALIGN_CLASS[slide.align])}>
          {slide.badge && (
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/15 px-4 py-1.5 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
              </span>
              <span className="text-xs font-bold uppercase tracking-widest text-accent">{slide.badge}</span>
            </div>
          )}
          <h1 className={cn("font-display text-4xl font-black leading-none drop-shadow-lg sm:text-5xl lg:text-7xl", dark ? "text-media-ink" : "text-on-media")}>
            {slide.title}
          </h1>
          <span className="mt-5 h-1 w-20 rounded-full bg-accent" />
          {slide.subtitle && (
            <p className={cn("mt-5 max-w-xl text-base sm:text-lg lg:text-xl", dark ? "text-media-ink/80" : "text-on-media/85")}>{slide.subtitle}</p>
          )}
          {(slide.cta_label || slide.secondary_cta_label) && (
            <div className={cn("mt-8 flex flex-col gap-3 sm:flex-row", slide.align === "center" && "sm:justify-center")}>
              {slide.cta_label && (
                <Button asChild size="lg" className="gap-2 shadow-glow">
                  <SlideLink url={slide.cta_url}>
                    {slide.cta_label}
                    <ArrowRight className="h-5 w-5" />
                  </SlideLink>
                </Button>
              )}
              {slide.secondary_cta_label && (
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className={cn(
                    "backdrop-blur-sm",
                    dark ? "border-media-ink/30 text-media-ink hover:bg-media-ink/10" : "border-on-media/30 bg-on-media/5 text-on-media hover:bg-on-media/15",
                  )}
                >
                  <SlideLink url={slide.secondary_cta_url}>{slide.secondary_cta_label}</SlideLink>
                </Button>
              )}
            </div>
          )}
        </div>

        {sale?.show_hero_card && slide.align !== "right" && (
          <FlashSaleCard sale={sale} variant="glass" className="hidden w-80 shrink-0 animate-fade-up xl:block" />
        )}
      </div>

      {count > 1 && (settings.show_dots || settings.show_arrows) && (
        <div className="absolute inset-x-0 bottom-24 z-10 mx-auto flex w-full max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
          {settings.show_dots && (
            <>
              <span className={cn("font-display text-sm font-bold tabular-nums", dark ? "text-media-ink" : "text-on-media")}>
                {padTwo(current + 1)} <span className="opacity-40">/ {padTwo(count)}</span>
              </span>
              <div className="flex flex-1 gap-2">
                {slides.map((s, i) => (
                  <button
                    key={s._id}
                    type="button"
                    aria-label={`Go to slide ${i + 1}`}
                    onClick={() => setIndex(i)}
                    className={cn("h-1 flex-1 overflow-hidden rounded-full sm:max-w-24", dark ? "bg-media-ink/20" : "bg-on-media/25")}
                  >
                    {i === current && (
                      <span
                        key={`${s._id}-${index}`}
                        className={cn("block h-full origin-left bg-accent", autoplay && "animate-progress")}
                        style={autoplay ? { animationDuration: `${intervalMs}ms`, animationPlayState: paused ? "paused" : "running" } : undefined}
                      />
                    )}
                    {i < current && <span className={cn("block h-full", dark ? "bg-media-ink/60" : "bg-on-media/70")} />}
                  </button>
                ))}
              </div>
            </>
          )}
          {settings.show_arrows && (
            <div className="ml-auto flex gap-2">
              <Button type="button" variant="outline" size="icon" aria-label="Previous slide" onClick={() => step(-1)} className={arrowClass}>
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button type="button" variant="outline" size="icon" aria-label="Next slide" onClick={() => step(1)} className={arrowClass}>
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
