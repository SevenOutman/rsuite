import * as React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import compose from 'recompose/compose';

import { withStyleProps, defaultProps, prefix } from '../utils';
import { StandardProps } from '../@types/common';

export interface LoaderProps extends StandardProps {
  /** Centered in the container */
  center?: boolean;

  /** Whether the background is displayed */
  backdrop?: boolean;

  /** An alternative dark visual style for the Loader */
  inverse?: boolean;

  /** The icon is displayed vertically with the text */
  vertical?: boolean;

  /** Custom descriptive text */
  content?: React.ReactNode;

  /** The speed at which the loader rotates */
  speed?: 'normal' | 'fast' | 'slow';
}

function Loader({
  classPrefix,
  className,
  inverse,
  backdrop,
  speed,
  center,
  vertical,
  content,
  ...props
}: LoaderProps) {
  const hasContent = !!content;
  const addPrefix = prefix(classPrefix);
  const classes = classNames(addPrefix('wrapper'), addPrefix(`speed-${speed}`), className, {
    [addPrefix('backdrop-wrapper')]: backdrop,
    [addPrefix('vertical')]: vertical,
    [addPrefix('inverse')]: inverse,
    [addPrefix('center')]: center,
    [addPrefix('has-content')]: hasContent
  });

  return (
    <div {...props} className={classes}>
      {backdrop && <div className={addPrefix('backdrop')} />}
      <div className={classPrefix}>
        <span className={addPrefix('spin')} />
        {hasContent && <span className={addPrefix('content')}>{content}</span>}
      </div>
    </div>
  );
}

Loader.propTypes = {
  className: PropTypes.string,
  classPrefix: PropTypes.string,
  center: PropTypes.bool,
  backdrop: PropTypes.bool,
  inverse: PropTypes.bool,
  vertical: PropTypes.bool,
  content: PropTypes.node,
  speed: PropTypes.oneOf(['normal', 'fast', 'slow'])
};

Loader.defaultProps = {
  speed: 'normal'
};

export default compose<any, LoaderProps>(
  withStyleProps<LoaderProps>({
    hasSize: true
  }),
  defaultProps<LoaderProps>({
    classPrefix: 'loader'
  })
)(Loader);
