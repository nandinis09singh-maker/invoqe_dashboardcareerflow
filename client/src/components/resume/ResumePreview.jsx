import React, { forwardRef } from 'react';
import TemplateModern from './TemplateModern';
import TemplateClassic from './TemplateClassic';
import TemplateMinimal from './TemplateMinimal';
import TemplateCreative from './TemplateCreative';

const ResumePreview = forwardRef(function ResumePreview(
  {
    content,
    template = 'modern',
    accentColor = '#4f46e5',
    fontFamily = 'Inter',
    fontSize = 'normal',
    className = ''
  },
  ref
) {
  const fontStyle = {
    fontFamily:
      fontFamily === 'Merriweather'
        ? 'Merriweather, Georgia, serif'
        : fontFamily === 'Roboto'
        ? 'Roboto, sans-serif'
        : fontFamily === 'Poppins'
        ? 'Poppins, sans-serif'
        : 'Inter, -apple-system, sans-serif'
  };

  const renderTemplate = () => {
    switch (template) {
      case 'classic':
        return <TemplateClassic content={content} accentColor={accentColor} fontSize={fontSize} />;
      case 'minimal':
        return <TemplateMinimal content={content} accentColor={accentColor} fontSize={fontSize} />;
      case 'creative':
        return <TemplateCreative content={content} accentColor={accentColor} fontSize={fontSize} />;
      case 'modern':
      default:
        return <TemplateModern content={content} accentColor={accentColor} fontSize={fontSize} />;
    }
  };

  return (
    <div
      ref={ref}
      id="resume-print-node"
      style={fontStyle}
      className={`w-full max-w-[800px] min-h-[1130px] bg-white text-slate-900 shadow-elevated rounded-xl border border-slate-200/80 overflow-hidden print:shadow-none print:border-none print:rounded-none print:w-full print:max-w-none print:min-h-0 print:m-0 ${className}`}
    >
      {renderTemplate()}
    </div>
  );
});

export default ResumePreview;
