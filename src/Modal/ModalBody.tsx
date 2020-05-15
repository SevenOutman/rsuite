import * as React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { defaultProps } from '../utils';
import ModalContext from './ModalContext';
import { StandardProps } from '../@types/common';

export interface ModalBodyProps extends StandardProps {
  /** Primary content */
  children?: React.ReactNode;
}

function ModalBody({ classPrefix, className, style, ...props }: ModalBodyProps) {
  const classes = classNames(classPrefix, className);

  return (
    <ModalContext.Consumer>
      {context => {
        const bodyStyles = context ? context.getBodyStyles() : {};
        return <div {...props} style={{ ...bodyStyles, ...style }} className={classes} />;
      }}
    </ModalContext.Consumer>
  );
}

ModalBody.propTypes = {
  classPrefix: PropTypes.string,
  className: PropTypes.string
};

export default defaultProps({
  classPrefix: 'modal-body'
})(ModalBody);
