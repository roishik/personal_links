import { FC, useRef, useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Badge } from '@/components/ui/badge';
import { ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import useEmblaCarousel from 'embla-carousel-react';
import { cn } from '@/lib/utils';

// Generic Card data for testing
const cardData = [
  {
    id: 1,
    title: 'Project One',
    description: 'A sample description for the first project',
    badge: 'Technology',
    link: 'https://example.com/project1'
  },
  {
    id: 2,
    title: 'Project Two',
    description: 'A sample description for the second project',
    badge: 'Research',
    link: 'https://example.com/project2'
  },
  {
    id: 3,
    title: 'Project Three',
    description: 'A sample description for the third project',
    badge: 'Innovation',
    link: 'https://example.com/project3'
  },
  {
    id: 4,
    title: 'Project Four',
    description: 'A sample description for the fourth project',
    badge: 'Development',
    link: 'https://example.com/project4'
  }
];

const CardCarousel: FC = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'center',
    containScroll: 'trimSnaps',
    dragFree: true
  });
  
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    emblaApi.on('select', onSelect);
    // Initial setup
    onSelect();

    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi]);

  return (
    <motion.div 
      className="w-full max-w-5xl mx-auto py-10" 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold text-center mb-6">Featured Projects</h2>
      
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {cardData.map((card, index) => {
            const isCenter = index === selectedIndex;
            return (
              <div 
                key={card.id} 
                className={cn("flex-[0_0_70%] sm:flex-[0_0_50%] md:flex-[0_0_40%] min-w-0 px-4 transition-opacity duration-300",
                  isCenter ? 'opacity-100 scale-100' : 'opacity-60 scale-95'
                )}
              >
                <Card className="h-full flex flex-col transition-all duration-300 shadow-md">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <Badge variant="outline" className="mb-2">{card.badge}</Badge>
                      <a 
                        href={card.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-primary transition-colors"
                      >
                        <ExternalLink size={16} />
                      </a>
                    </div>
                    <CardTitle>{card.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <CardDescription>{card.description}</CardDescription>
                  </CardContent>
                  <CardFooter className="pt-2 border-t">
                    <p className="text-xs text-muted-foreground">View details</p>
                  </CardFooter>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="flex justify-center mt-6 space-x-4">
        <button 
          onClick={() => emblaApi?.scrollPrev()} 
          className="p-2 rounded-full bg-white shadow-md hover:bg-gray-50 transition-colors"
          aria-label="Previous slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6"/>
          </svg>
        </button>
        <button 
          onClick={() => emblaApi?.scrollNext()} 
          className="p-2 rounded-full bg-white shadow-md hover:bg-gray-50 transition-colors"
          aria-label="Next slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m9 18 6-6-6-6"/>
          </svg>
        </button>
      </div>
    </motion.div>
  );
};

export default CardCarousel;
