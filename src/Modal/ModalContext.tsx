import * as React from 'react';
import { createContext } from '../utils';

export interface ModalContextProps {
  onModalHide: (event: React.MouseEvent<Element, MouseEvent>) => void;
  getBodyStyles?: () => React.CSSProperties;
}

const ModalContext = createContext<ModalContextProps>(null);

export default ModalContext;
