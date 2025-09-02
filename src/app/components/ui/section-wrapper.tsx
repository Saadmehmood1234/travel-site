import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SectionWrapperProps {
  children: ReactNode;
  className?: string;
  id?: string;
  background?: 'default' | 'gradient' | 'white' | 'primary';
}

export function SectionWrapper({ 
  children, 
  className, 
  id, 
  background = 'default' 
}: SectionWrapperProps) {
  const backgroundClasses = {
    default: 'bg-white',
    gradient: 'gradient-bg',
    white: 'bg-white',
    primary: 'bg-primary-50'
  };

  return (
    <section 
      id={id}
      className={cn(
        'section-padding',
        backgroundClasses[background],
        className
      )}
    >
      <div className="max-w-7xl mx-auto container-padding">
        {children}
      </div>
    </section>
  );
}
