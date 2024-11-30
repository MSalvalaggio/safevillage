import React from 'react';

const Card = ({ title, image, description }) => (
  <div className="bg-white rounded-lg shadow-lg overflow-hidden">
    <img 
      src={image} 
      alt={title} 
      className="w-full h-48 object-cover"
      onError={(e) => {
        e.target.src = '/images/placeholder.jpg';
      }}
    />
    <div className="p-4">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  </div>
);

export default Card;