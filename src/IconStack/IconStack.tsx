import * as React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { defaultProps, prefix } from '../utils';
import { StandardProps } from '../@types/common';

export interface IconStackProps extends StandardProps {
  /** Sets the icon size */
  size?: 'lg' | '2x' | '3x' | '4x' | '5x';
}

function IconStack({ className, size, classPrefix, ...props }: IconStackProps) {
  const addPrefix = prefix(classPrefix);
  const classes = classNames(classPrefix, className, {
    [addPrefix(`size-${size || ''}`)]: size
  });

  return <span {...props} className={classes} />;
}

IconStack.propTypes = {
  className: PropTypes.string,
  classPrefix: PropTypes.string,
  size: PropTypes.oneOf<IconStackProps['size']>(['lg', '2x', '3x', '4x', '5x'])
};

export default defaultProps<IconStackProps>({
  classPrefix: 'icon-stack'
})(IconStack);
