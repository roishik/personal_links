import { FC } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Badge } from '@/components/ui/badge';
import { ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

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
  return (
    <motion.div 
      className="w-full max-w-4xl mx-auto py-10" 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold text-center mb-6">Featured Projects</h2>
      <Carousel className="w-full">
        <CarouselContent>
          {cardData.map((card) => (
            <CarouselItem key={card.id} className="md:basis-1/2 lg:basis-1/3 pl-4">
              <div className="p-1 h-full">
                <Card className="h-full flex flex-col">
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
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex justify-center mt-4 space-x-2">
          <CarouselPrevious className="static translate-y-0 translate-x-0" />
          <CarouselNext className="static translate-y-0 translate-x-0" />
        </div>
      </Carousel>
    </motion.div>
  );
};

export default CardCarousel;
