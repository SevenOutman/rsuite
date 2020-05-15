import * as React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { defaultProps } from '../utils';
import { StandardProps } from '../@types/common';

export interface ModalFooterProps extends StandardProps {
  /** Primary content */
  children?: React.ReactNode;
}

function ModalFooter({ classPrefix, className, ...props }: ModalFooterProps) {
  const classes = classNames(classPrefix, className);
  return <div {...props} className={classes} />;
}

ModalFooter.propTypes = {
  classPrefix: PropTypes.string,
  className: PropTypes.string
};

export default defaultProps<ModalFooterProps>({
  classPrefix: 'modal-footer'
})(ModalFooter);
