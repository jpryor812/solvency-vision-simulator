
import React from 'react';

const Disclaimer: React.FC = () => {
  return (
    <div className="mt-8 p-4 text-center text-sm text-gray-500 border-t">
      <p>
        Estimates use SSA 2024 intermediate projections and stylized coefficients; actual actuarial scoring would differ.
        <br />
        Built with Lovable AI-Builder.
      </p>
    </div>
  );
};

export default Disclaimer;
