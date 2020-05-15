import * as React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { defaultProps } from '../utils';
import { StandardProps } from '../@types/common';

export interface ButtonToolbarProps extends StandardProps {
  /** Primary content */
  children?: React.ReactNode;
}

function ButtonToolbar({ className, classPrefix, ...props }: ButtonToolbarProps) {
  const classes = classNames(classPrefix, className);
  return <div role="toolbar" className={classes} {...props} />;
}

ButtonToolbar.propTypes = {
  className: PropTypes.string,
  classPrefix: PropTypes.string
};

ButtonToolbar.defaultProps = {
  classPrefix: 'btn-toolbar'
};

export default defaultProps<ButtonToolbarProps>({
  classPrefix: 'btn-toolbar'
})(ButtonToolbar);
