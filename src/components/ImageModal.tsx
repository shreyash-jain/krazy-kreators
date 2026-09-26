'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { fullSizeSrc } from '@/data/portfolioFullSize';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
  productName: string;
  categoryName?: string;
}

export default function ImageModal({ 
  isOpen, 
  onClose, 
  images, 
  currentIndex, 
  onIndexChange, 
  productName,
  categoryName 
}: ImageModalProps) {
  // The grid shows compressed WebPs; the modal swaps in the untouched
  // original once it has loaded, so magnifying never shows a downscaled file.
  const [fullLoaded, setFullLoaded] = useState(false);

  const displaySrc = images[currentIndex];
  const fullSrc = displaySrc ? fullSizeSrc(displaySrc) : displaySrc;
  const hasSeparateFull = fullSrc !== displaySrc;

  useEffect(() => {
    setFullLoaded(false);
  }, [isOpen, currentIndex, fullSrc]);

  const nextImage = useCallback(() => {
    if (images.length <= 1) return;
    onIndexChange((currentIndex + 1) % images.length);
  }, [images.length, currentIndex, onIndexChange]);

  const prevImage = useCallback(() => {
    if (images.length <= 1) return;
    onIndexChange((currentIndex - 1 + images.length) % images.length);
  }, [images.length, currentIndex, onIndexChange]);

  const goToImage = useCallback((index: number) => {
    if (index === currentIndex) return;
    onIndexChange(index);
  }, [currentIndex, onIndexChange]);

  const downloadName = (() => {
    const label = (categoryName || productName || 'krazy-kreators')
      .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const ext = fullSrc?.match(/\.[a-z0-9]+$/i)?.[0] ?? '';
    return `${label}-${currentIndex + 1}${ext}`;
  })();

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        prevImage();
      } else if (e.key === 'ArrowRight') {
        nextImage();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, prevImage, nextImage]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      // Store the current scroll position
      const scrollY = window.scrollY;
      
      // Prevent scrolling
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
    } else {
      // Restore scrolling
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      
      // Restore scroll position
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }

    return () => {
      // Cleanup: restore scrolling
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
         role="dialog" aria-modal="true">
      {/* Download original + close */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        <a
          href={fullSrc}
          download={downloadName}
          className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition-all duration-300 hover:scale-110"
          aria-label="Download original image"
          title="Download original image"
        >
          <Download className="w-6 h-6" />
        </a>
        <button
          onClick={onClose}
          className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition-all duration-300 hover:scale-110"
          aria-label="Close modal"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Category name */}
      <div className="absolute top-4 left-4 z-10 bg-black/50 text-white px-4 py-2 rounded-lg backdrop-blur-sm">
        <h3 className="text-lg font-medium">{categoryName || productName}</h3>
      </div>


      {/* Main image container */}
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-all duration-300 hover:scale-110"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-all duration-300 hover:scale-110"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Image */}
        <div className="relative w-full h-full flex items-center justify-center p-16"
             style={{ WebkitTransform: 'translateZ(0)', transform: 'translateZ(0)' }}>
          {/* Compressed version paints immediately... */}
          <Image
            src={displaySrc}
            alt={`${productName} - Image ${currentIndex + 1}`}
            width={1200}
            height={800}
            className="w-full h-full object-contain rounded-lg"
            priority
          />
          {/* ...and the original fades in over it once downloaded. */}
          {hasSeparateFull && (
            <Image
              key={fullSrc}
              src={fullSrc}
              alt=""
              aria-hidden
              width={1600}
              height={2400}
              unoptimized
              className={`absolute inset-0 w-full h-full p-16 object-contain rounded-lg transition-opacity duration-300 ${
                fullLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setFullLoaded(true)}
            />
          )}
          {hasSeparateFull && !fullLoaded && (
            <div className="absolute bottom-6 right-6 flex items-center gap-2 bg-black/50 text-white/80 text-xs px-3 py-1.5 rounded-full backdrop-blur-sm">
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
              Loading full resolution
            </div>
          )}
        </div>
      </div>

      {/* Thumbnail navigation */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
          <div className="flex space-x-2 bg-black/50 p-2 rounded-lg backdrop-blur-sm">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => goToImage(index)}
                className={`relative w-16 h-16 rounded-lg overflow-hidden transition-all duration-300 ${
                  index === currentIndex 
                    ? 'ring-2 ring-white scale-110' 
                    : 'hover:scale-105 opacity-70 hover:opacity-100'
                }`}
              >
                <Image
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
