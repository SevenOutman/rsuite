import * as React from 'react';
import createContext from '../utils/createContext';

export const IntlGlobalContext = createContext<IntlProviderProps>(null);

export interface IntlProviderProps {
  /** Language configuration */
  locale?: object;

  /** Support right-to-left */
  rtl?: boolean;

  /** Date Formatting API */
  formatDate?: (
    date: Date | string | number,
    format?: string,
    options?: {
      locale?: object;
    }
  ) => string;

  /** Primary content */
  children?: React.ReactNode;
}

const IntlProvider = ({ locale, rtl, children, formatDate }: IntlProviderProps) => {
  return (
    <IntlGlobalContext.Provider value={{ ...locale, rtl, formatDate }}>
      {children}
    </IntlGlobalContext.Provider>
  );
};

export default IntlProvider;
