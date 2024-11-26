import React, { useState } from 'react';

interface ImageCarouselProps {
  images: string[];
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPreviousSlide = (): any => {
    setCurrentIndex(prevIndex =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
    return null;
  };

  const goToNextSlide = (): any => {
    setCurrentIndex(prevIndex =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
    return null;
  };

  return (
    <div className="flex justify-start w-full mb-20 md:pl-0">
      <div className="w-fit">
        <div className="max-w-full w-fit h-[300px] bg-transparent">
          <div className="relative bg-black max-w-full px-2 py-2">
            <h1 className="text-white font-poppins text-sm">
              {images.length} page
            </h1>
          </div>
          <div className="flex justify-center h-full w-full">
            {images[currentIndex].split('.')[
              images[currentIndex].split('.').length - 1
            ] !== 'mp4' ? (
              <img
                src={images[currentIndex]}
                alt={`Slide ${currentIndex}`}
                className="max-w-full max-h-[300px] object-fit transition-transform duration-300 transform"
              />
            ) : (
              <video
                controls
                className="max-w-[50vw] max-h-[50vh] object-fit"
                key={images[currentIndex]}
              >
                <source src={images[currentIndex]} type="video/mp4" />
                Browser Anda tidak mendukung tag video.
              </video>
            )}
          </div>
          <div className="relative bg-black max-w-full px-2 py-2">
            <h1 className="text-white font-poppins text-sm">
              {currentIndex + 1} / {images.length}
            </h1>
          </div>
          <div className="w-full p-4">
            <div className="relative bottom-10 flex justify-center space-x-2">
              {images.map((_, index) => (
                <div
                  key={index}
                  className={`w-4 h-4 rounded-full ${
                    index === currentIndex ? 'bg-seeds-green' : 'bg-gray-300'
                  }`}
                  onClick={(): any => {
                    setCurrentIndex(index);
                  }}
                ></div>
              ))}
            </div>
            <div className="relative bottom-[25vh] flex justify-between">
              <button
                className="bg-gray-800 text-white p-1 rounded-full hover:bg-gray-600"
                onClick={goToPreviousSlide}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 19.5L8.25 12l7.5-7.5"
                  />
                </svg>
              </button>
              <button
                className="bg-gray-800 text-white p-1 rounded-full hover:bg-gray-600"
                onClick={goToNextSlide}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 4.5l7.5 7.5-7.5 7.5"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageCarousel;
