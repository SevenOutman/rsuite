import * as React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { defaultProps } from '../utils';

export interface NavbarBodyProps {
  classPrefix?: string;
  className?: string;
  children?: React.ReactNode;
}

function NavbarBody({ children, classPrefix, className, ...props }: NavbarBodyProps) {
  const classes = classNames(classPrefix, className);

  return (
    <div {...props} className={classes}>
      {children}
    </div>
  );
}

NavbarBody.propTypes = {
  classPrefix: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node
};

export default defaultProps<NavbarBodyProps>({
  classPrefix: 'navbar-body'
})(NavbarBody);
