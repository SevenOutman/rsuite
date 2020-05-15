import * as React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { defaultProps } from '../utils';
import { StandardProps } from '../@types/common';

export interface HeaderProps extends StandardProps {
  /** Primary content */
  children?: React.ReactNode;
}

function Header({ className, classPrefix, ...props }: HeaderProps) {
  const classes = classNames(classPrefix, className);
  return <div {...props} className={classes} />;
}

Header.propTypes = {
  className: PropTypes.string,
  classPrefix: PropTypes.string
};

export default defaultProps<HeaderProps>({
  classPrefix: 'header'
})(Header);
