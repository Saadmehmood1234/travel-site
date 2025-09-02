import React, { ReactNode } from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  badge?: string;
  title: string | ReactNode;
  subtitle?: string;
  children?: ReactNode;
  className?: string;
  centered?: boolean;
}

export function SectionHeader({ 
  badge, 
  title, 
  subtitle, 
  children, 
  className,
  centered = true
}: SectionHeaderProps) {
  return (
    <div className={cn(
      'mb-12 md:mb-16',
      centered && 'text-center',
      className
    )}>
      {badge && (
        <Badge className="bg-gradient-to-r from-primary-500 to-secondary-500 mb-6">
          {badge}
        </Badge>
      )}
      <h2 className="section-title mb-6">
        {title}
      </h2>
      {subtitle && (
        <p className="section-subtitle mb-8">
          {subtitle}
        </p>
      )}
      {children}
    </div>
  );
}
