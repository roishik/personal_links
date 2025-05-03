import { FC, useRef, useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Badge } from '@/components/ui/badge';
import { ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import useEmblaCarousel from 'embla-carousel-react';
import { cn } from '@/lib/utils';

// Using direct URL for images to avoid import issues

// Project data
interface ProjectCard {
  id: number;
  title: string;
  description: string;
  badge: string;
  link: string;
  image?: string;
}

const cardData: ProjectCard[] = [
  {
    id: 1,
    title: 'Locals app',
    description: 'By enabling regular customers to pre‑buy vouchers during COVID‑19 lockdowns, \'Locals\' generated thousands of purchases and funneled crucial revenue to small businesses when walk‑in trade was halted by restrictions.',
    badge: 'Innovation',
    link: 'https://bit.ly/localsynet',
    image: 'https://raw.githubusercontent.com/roishik/personal_links/main/attached_assets/image_1746302129094.png' // Using the GitHub hosted image
  },
  {
    id: 2,
    title: 'The first Hebrew NFT',
    description: 'Pardes Shmaryahu broke ground as the first Hebrew NFT collection, minting 200 collectible 3‑D orchard‑plot tokens that satirically echoed Israel\'s real‑estate bubble and introduced local audiences to the blockchain art scene.',
    badge: 'Technology',
    link: 'https://www.ynet.co.il/digital/technews/article/sjdlp11spt',
    image: 'https://raw.githubusercontent.com/roishik/personal_links/main/attached_assets/image_1746303490026.png'
  },
  {
    id: 3,
    title: 'My M.Sc. thesis',
    description: 'My M.Sc. thesis built a deep‑learning pipeline that pinpoints fatigue striations on SEM fracture images, shrinking fractographic analysis from days to minutes and releasing a unique hand‑labeled dataset on Kaggle that has since powered several follow‑up studies.',
    badge: 'Research',
    link: 'https://cadlab.net.technion.ac.il/roi-shikler-m-sc-thesis/',
    image: 'https://raw.githubusercontent.com/roishik/personal_links/main/attached_assets/image_1746304125421.png'
  },

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

    // Auto-scroll every 15 seconds
    const autoScrollInterval = setInterval(() => {
      emblaApi.scrollNext();
    }, 15000);

    return () => {
      emblaApi.off('select', onSelect);
      clearInterval(autoScrollInterval);
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
                <Card className="h-full flex flex-col transition-all duration-300 shadow-md overflow-hidden">
                  {card.image && (
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={card.image} 
                        alt={`${card.title} preview`} 
                        className="w-full h-full object-cover object-center"
                      />
                    </div>
                  )}
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
