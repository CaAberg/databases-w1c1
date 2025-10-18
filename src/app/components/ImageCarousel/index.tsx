'use client'

import { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface ImageCarouselProps {
    images: string[];
}

const ImageCarousel = ({ images }: ImageCarouselProps) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);

    if (!images || images.length === 0) {
        return null;
    }

    if (images.length === 1) {
        return (
            <>
                <div className="flex justify-center">
                    <div className="relative w-full max-w-2xl" style={{ maxHeight: '600px' }}>
                        <img 
                            src={images[0]} 
                            alt="Post image" 
                            className="w-full h-auto max-h-[600px] object-contain rounded-lg shadow-md hover:cursor-pointer"
                            onClick={() => setIsFullscreen(true)}
                        />
                    </div>
                </div>
                
                
                {isFullscreen && (
                    <div 
                        className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
                        onClick={() => setIsFullscreen(false)}
                    >
                        <button
                            onClick={() => setIsFullscreen(false)}
                            className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white 
                                       p-2 rounded-full transition-all z-10"
                            aria-label="Close fullscreen"
                        >
                            <X className="w-6 h-6" />
                        </button>
                        <img 
                            src={images[0]} 
                            alt="Post image fullscreen" 
                            className="max-w-full max-h-full object-contain"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                )}
            </>
        );
    }

    
    const goToPrevious = () => {
        setCurrentIndex((prevIndex) => 
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
    };

    const goToNext = () => {
        setCurrentIndex((prevIndex) => 
            prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
    };

    return (
        <>
            <div className="relative w-full max-w-3xl mx-auto">
                
                <div className="relative w-full bg-gray-100 rounded-lg overflow-hidden shadow-md h-[300px] md:h-[500px]">
                    <img 
                        src={images[currentIndex]} 
                        alt={`Post image ${currentIndex + 1}`} 
                        className="w-full h-full object-contain hover:cursor-pointer"
                        onClick={() => setIsFullscreen(true)}
                    />
                
                
                <button
                    onClick={goToPrevious}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 
                               text-white p-2 rounded-full transition-all duration-200 
                               focus:outline-none focus:ring-2 focus:ring-white hover:cursor-pointer"
                    aria-label="Previous image"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>
                
                <button
                    onClick={goToNext}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 
                               text-white p-2 rounded-full transition-all duration-200 
                               focus:outline-none focus:ring-2 focus:ring-white hover:cursor-pointer"
                    aria-label="Next image"
                >
                    <ChevronRight className="w-6 h-6" />
                </button>

                
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white 
                                px-3 py-1 rounded-full text-sm font-medium">
                    {currentIndex + 1} / {images.length}
                </div>
            </div>

            
            <div className="flex justify-center gap-2 mt-4 flex-wrap">
                {images.map((image, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-16 h-16 rounded-md overflow-hidden border-2 hover:cursor-pointer transition-all
                                    ${index === currentIndex 
                                        ? 'border-blue-500 ring-2 ring-blue-300' 
                                        : 'border-gray-300 hover:border-gray-400'}`}
                        aria-label={`Go to image ${index + 1}`}
                    >
                        <img 
                            src={image} 
                            alt={`Thumbnail ${index + 1}`} 
                            className="w-full h-full object-cover"
                        />
                    </button>
                ))}
            </div>
        </div>

        
        {isFullscreen && (
            <div 
                className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
                onClick={() => setIsFullscreen(false)}
            >
                <button
                    onClick={() => setIsFullscreen(false)}
                    className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white 
                               p-2 rounded-full transition-all z-10 hover:cursor-pointer"
                    aria-label="Close fullscreen"
                >
                    <X className="w-6 h-6" />
                </button>
                
                
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        goToPrevious();
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 
                               text-white p-3 rounded-full transition-all z-10 hover:cursor-pointer"
                    aria-label="Previous image"
                >
                    <ChevronLeft className="w-8 h-8" />
                </button>
                
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        goToNext();
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 
                               text-white p-3 rounded-full transition-all z-10 hover:cursor-pointer"
                    aria-label="Next image"
                >
                    <ChevronRight className="w-8 h-8" />
                </button>
                
                
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white/20 text-white 
                                px-4 py-2 rounded-full text-base font-medium z-10">
                    {currentIndex + 1} / {images.length}
                </div>
                
                <img 
                    src={images[currentIndex]} 
                    alt={`Post image ${currentIndex + 1} fullscreen`} 
                    className="max-w-[calc(100%-6rem)] max-h-[calc(100%-8rem)] object-contain"
                    onClick={(e) => e.stopPropagation()}
                />
            </div>
        )}
    </>
    );
};

export default ImageCarousel;
