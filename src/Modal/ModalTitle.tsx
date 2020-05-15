import * as React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { defaultProps } from '../utils';
import { StandardProps } from '../@types/common';

export interface ModalTitleProps extends StandardProps {
  /** Primary content */
  children?: React.ReactNode;
}

function ModalTitle({ className, classPrefix, children, ...props }: ModalTitleProps) {
  const classes = classNames(classPrefix, className);
  return (
    <h4 {...props} className={classes}>
      {children}
    </h4>
  );
}

ModalTitle.propTypes = {
  className: PropTypes.string,
  classPrefix: PropTypes.string,
  children: PropTypes.node
};

export default defaultProps<ModalTitleProps>({
  classPrefix: 'modal-title'
})(ModalTitle);
