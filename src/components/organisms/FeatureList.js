import React from 'react';
import Feature from '../molecules/Feature';
import './FeatureList.css';

const features = [
  {
    id: 1,
    icon: '🇫🇷',
    title: 'Native Speakers',
    description: 'Learn from experienced native French speakers'
  },
  {
    id: 2,
    icon: '🎯',
    title: 'Personalized',
    description: 'Custom lessons based on your level and goals'
  },
  {
    id: 3,
    icon: '🕒',
    title: 'Flexible Schedule',
    description: 'Book lessons at times that work for you'
  }
];

const FeatureList = () => {
  return (
    <div className="feature-list">
      {features.map(feature => (
        <Feature
          key={feature.id}
          icon={feature.icon}
          title={feature.title}
          description={feature.description}
        />
      ))}
    </div>
  );
};

export default FeatureList; 