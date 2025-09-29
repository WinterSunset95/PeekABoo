import React from 'react';
import { Link } from 'react-router-dom';
import { MovieInfo } from '../lib/types';
import { Button } from './ui/button';
import { PlayCircle } from 'lucide-react';

interface FeaturedCardProps {
  item: MovieInfo;
}

function FeaturedCard({ item }: FeaturedCardProps) {
  return (
    <Link to={`/${item.Type}/${item.Id}`} className="block">
      <div className="group relative aspect-video w-full rounded-lg overflow-hidden shadow-lg">
        <img src={item.Poster} alt={`Poster for ${item.Title}`} className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h2 className="text-3xl font-bold">{item.Title}</h2>
          <p className="mt-2 text-sm line-clamp-3 text-white/90">
            {item.Overview}
          </p>
          <Button variant="secondary" className="mt-4">
            <PlayCircle className="mr-2 h-5 w-5" />
            Watch Now
          </Button>
        </div>
      </div>
    </Link>
  );
};

export default FeaturedCard;
