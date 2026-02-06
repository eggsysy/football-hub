import React from 'react';

interface MatchPageProps {
  params: {
    id: string;
  };
}

const MatchPage: React.FC<MatchPageProps> = ({ params }) => {
  return (
    <div className="min-h-screen px-6 md:px-8 pb-24 bg-[#111F35] text-white">
      <h1 className="text-4xl md:text-6xl font-black uppercase leading-[0.9] text-white mb-8">
        Match Details for ID: {params.id}
      </h1>
      <p>This page will display the details for match {params.id}.</p>
    </div>
  );
};

export default MatchPage;