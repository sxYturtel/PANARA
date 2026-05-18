import { Calendar, ExternalLink } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface NewsCardProps {
  title: string;
  summary: string;
  date: string;
  image: string;
  category: string;
}

export function NewsCard({ title, summary, date, image, category }: NewsCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow border border-gray-100">
      <div className="relative h-48 bg-gray-200">
        <ImageWithFallback 
          src={image} 
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 left-3">
          <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm">
            {category}
          </span>
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
          {title}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {summary}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <Calendar className="w-4 h-4" />
            <span>{date}</span>
          </div>
          <button className="flex items-center gap-1 text-green-600 hover:text-green-700 text-sm font-medium">
            Baca <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
