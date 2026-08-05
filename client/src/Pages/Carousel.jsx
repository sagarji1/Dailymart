// src/pages/HomePage.jsx
import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
const HomePage = () => {
  return (
    <div className="bg-gray-50">
      {/* Carousel Section */}
      <section className="max-w-6xl mx-auto px-4 mt-6">
        <div className="rounded-xl overflow-hidden shadow-lg">
          <Carousel
            autoPlay
            infiniteLoop
            showThumbs={false}
            showStatus={false}
            showIndicators={true}
            interval={4000}
            stopOnHover={true}
            swipeable={true}
            emulateTouch={true}
          >
            <div>
              <img
                src="https://images.unsplash.com/photo-1641029956071-272caab5857a?q=80&w=1028&auto=format&fit=crop"
                alt="Grocery"
                className="w-full h-[75vh] object-cover"
              />
            </div>
            <div>
              <img
                src="https://images.unsplash.com/photo-1644501810962-3a7428e1df93?q=80&w=1170&auto=format&fit=crop"
                alt="Vegetables"
                className="w-full h-[75vh] object-cover"
              />
            </div>
            <div>
              <img
                src="https://images.unsplash.com/photo-1584680226833-0d680d0a0794?q=80&w=1170&auto=format&fit=crop"
                alt="Fruits"
                className="w-full h-[75vh] object-cover"
              />
            </div>
          </Carousel>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
