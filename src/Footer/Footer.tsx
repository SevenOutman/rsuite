import * as React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { defaultProps } from '../utils';
import { StandardProps } from '../@types/common';

export interface FooterProps extends StandardProps {
  /** Primary content */
  children?: React.ReactNode;
}

function Footer({ className, classPrefix, ...props }: FooterProps) {
  const classes = classNames(classPrefix, className);

  return <div {...props} className={classes} />;
}

Footer.propTypes = {
  className: PropTypes.string,
  classPrefix: PropTypes.string
};

export default defaultProps({
  classPrefix: 'footer'
})(Footer);
