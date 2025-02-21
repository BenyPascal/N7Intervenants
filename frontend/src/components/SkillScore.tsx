import React from 'react';

interface SkillScoreProps {
  score: number;
}

export const SkillScore: React.FC<SkillScoreProps> = ({ score }) => {
  const getColor = () => {
    if (score >= 8) return 'bg-green-500';
    if (score >= 5) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <span className={`px-2 py-1 rounded-full text-white text-sm ${getColor()}`}>
      {score}
    </span>
  );
};