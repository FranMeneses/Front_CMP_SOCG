'use client';

interface LegendProps {
  valley: string[];
  valleyColors: string[];
}

export const Legend: React.FC<LegendProps> = ({ valley, valleyColors }) => {
  return (
    <div className="font-[Helvetica]">
      <div className="flex flex-col gap-8 mt-10 justify-center">
        {valley.map((valleyName, index) => (
          <div key={index} className="flex flex-row items-center font-light">
            <div
              className="w-6 h-6 rounded-full mr-2"
              style={{ backgroundColor: valleyColors[index] }}
            ></div>
            <h3 className="text-[#7D7D7D] text-sm font-medium">{valleyName}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};