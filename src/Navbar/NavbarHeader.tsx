import * as React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { defaultProps } from '../utils';

export interface NavbarHeaderProps {
  classPrefix?: string;
  className?: string;
}

function NavbarHeader({ className, classPrefix, ...props }: NavbarHeaderProps) {
  const classes = classNames(classPrefix, className);

  return <div {...props} className={classes} />;
}

NavbarHeader.propTypes = {
  classPrefix: PropTypes.string,
  className: PropTypes.string
};

export default defaultProps<NavbarHeaderProps>({
  classPrefix: 'navbar-header'
})(NavbarHeader);
