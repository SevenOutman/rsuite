import React from 'react';
import { Grid, CustomProvider } from 'rsuite';
import NProgress from 'nprogress';
import Router from 'next/router';
import AppContext from '@/components/AppContext';
import zhCN from '@rsuite-locales/zh_CN';
import enUS from '@rsuite-locales/en_US';
import * as Sentry from '@sentry/browser';
import '../less/index.less';

// Connecting the SDK to Sentry
if (!__DEV__) {
  Sentry.init({
    dsn: 'https://be402c47cb1a4d79b78ad283191299f7@sentry-prd.hypers.cc/7',
    release: `v${__VERSION__}`
  });
}

import { getMessages } from '../locales';
import {
  DirectionType,
  getDefaultTheme,
  readTheme,
  ThemeType,
  writeTheme
} from '../utils/themeHelpers';
import StyleHead from '../components/StyleHead';
import { canUseDOM } from 'dom-lib';

Router.events.on('routeChangeStart', url => {
  NProgress.start();
  if (__DEV__) {
    console.log(`Loading: ${url}`);
  }
});
Router.events.on('routeChangeComplete', () => {
  NProgress.done();

  window['_ha']?.('send', 'pageview', {
    title: document.title,
    url: document.location.href
  });
});
Router.events.on('routeChangeError', () => NProgress.done());

interface AppProps {
  Component: React.ElementType;
  pageProps: any;
}

function App({ Component, pageProps }: AppProps) {
  const [defaultThemeName, defaultDirection] = React.useMemo<[ThemeType, DirectionType]>(
    readTheme,
    [getDefaultTheme()]
  );
  const [themeName, setThemeName] = React.useState(defaultThemeName);
  const [direction, setDirection] = React.useState(defaultDirection);
  const [language, setLanguage] = React.useState(pageProps.userLanguage);
  const [styleLoaded, setStyleLoaded] = React.useState(false);
  const locale = language === 'zh' ? zhCN : enUS;

  const handleStyleHeadLoaded = React.useCallback(() => {
    setStyleLoaded(true);
  }, []);

  const onChangeTheme = React.useCallback(() => {
    const newThemeName = themeName === 'default' ? 'dark' : 'default';
    setThemeName(newThemeName);
    writeTheme(newThemeName, direction);
  }, [themeName, direction]);

  React.useEffect(() => {
    if (!canUseDOM) {
      return;
    }
    const media = matchMedia('(prefers-color-scheme: dark)');
    media?.addEventListener?.('change', onChangeTheme);

    return () => {
      media?.removeEventListener?.('change', onChangeTheme);
    };
  }, [themeName, direction, onChangeTheme]);

  const onChangeDirection = React.useCallback(() => {
    const newDirection = direction === 'ltr' ? 'rtl' : 'ltr';
    setDirection(newDirection);
    writeTheme(themeName, newDirection);
  }, [direction, themeName]);

  const onChangeLanguage = React.useCallback((value: string) => {
    setLanguage(value);
  }, []);

  const messages = getMessages(language);

  React.useEffect(() => {
    const oppositeThemeName = themeName === 'default' ? 'dark' : 'default';

    document.body.classList.add(`rs-theme-${themeName}`);
    document.body.classList.remove(`rs-theme-${oppositeThemeName}`);
  }, [themeName]);

  return (
    <React.StrictMode>
      <Grid fluid className="app-container">
        <CustomProvider locale={locale} rtl={direction === 'rtl'}>
          <AppContext.Provider
            value={{
              messages,
              language,
              localePath: language === 'zh' ? '/zh-CN' : '/en-US',
              theme: [themeName, direction],
              onChangeDirection,
              onChangeTheme,
              onChangeLanguage,
              styleLoaded
            }}
          >
            <StyleHead onLoaded={handleStyleHeadLoaded} />
            <Component {...pageProps} />
          </AppContext.Provider>
        </CustomProvider>
      </Grid>
    </React.StrictMode>
  );
}

App.getInitialProps = ({ ctx }) => {
  let pageProps = {
    userLanguage: 'en'
  };

  if (!process.browser) {
    pageProps = {
      userLanguage: ctx.query.userLanguage
    };
  }

  return {
    pageProps
  };
};

export default App;
