import React from 'react';
import { TemplateType } from '../../types';
import { GraduationCap, Shirt, FileText, Heart, PartyPopper } from 'lucide-react';

interface TemplateSelectorProps {
  selected: TemplateType;
  onSelect: (template: TemplateType) => void;
}

const templates: { type: TemplateType; name: string; icon: React.ReactNode; description: string }[] = [
  {
    type: 'graduation',
    name: '毕业纪念',
    icon: <GraduationCap className="w-8 h-8" />,
    description: '适合班级毕业留念',
  },
  {
    type: 'uniform',
    name: '校服风格',
    icon: <Shirt className="w-8 h-8" />,
    description: '经典校服背景',
  },
  {
    type: 'wedding',
    name: '婚礼祝福',
    icon: <Heart className="w-8 h-8" />,
    description: '浪漫婚礼主题',
  },
  {
    type: 'party',
    name: '派对聚会',
    icon: <PartyPopper className="w-8 h-8" />,
    description: '轻松活泼氛围',
  },
  {
    type: 'blank',
    name: '空白画布',
    icon: <FileText className="w-8 h-8" />,
    description: '自由发挥创意',
  },
];

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  selected,
  onSelect,
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {templates.map((template) => (
        <button
          key={template.type}
          onClick={() => onSelect(template.type)}
          className={`relative p-6 rounded-2xl transition-all duration-300 ${
            selected === template.type
              ? 'bg-gradient-to-br from-[#FF6B6B] to-[#FF8E53] text-white shadow-lg scale-105'
              : 'bg-white hover:shadow-md'
          }`}
        >
          <div className="flex flex-col items-center gap-3">
            <div
              className={`${
                selected === template.type ? 'text-white' : 'text-[#FF6B6B]'
              }`}
            >
              {template.icon}
            </div>
            <div className="text-center">
              <h3
                className={`font-semibold mb-1 ${
                  selected === template.type ? 'text-white' : 'text-gray-800'
                }`}
              >
                {template.name}
              </h3>
              <p
                className={`text-xs ${
                  selected === template.type
                    ? 'text-white/80'
                    : 'text-gray-500'
                }`}
              >
                {template.description}
              </p>
            </div>
          </div>

          {selected === template.type && (
            <div className="absolute top-2 right-2">
              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-[#FF6B6B] rounded-full" />
              </div>
            </div>
          )}
        </button>
      ))}
    </div>
  );
};
