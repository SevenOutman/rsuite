import * as React from 'react';

export interface RangeType {
  label: React.ReactNode;
  closeOverlay?: boolean;
  value: Date | ((pageDate?: Date) => Date);
}
