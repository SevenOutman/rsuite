import * as React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { createChainedFunction, defaultProps, prefix } from '../utils';
import ModalContext from './ModalContext';
import { StandardProps } from '../@types/common';

export interface ModalHeaderProps extends StandardProps {
  /** Primary content */
  children?: React.ReactNode;

  /** Display close button */
  closeButton?: boolean;

  /** Called when Modal is hidden */
  onHide?: (event: React.MouseEvent) => void;
}

function ModalHeader({
  classPrefix,
  onHide,
  className,
  closeButton,
  children,
  ...props
}: ModalHeaderProps) {
  const classes = classNames(classPrefix, className);
  const addPrefix = prefix(classPrefix);

  const buttonElement = (
    <ModalContext.Consumer>
      {context => (
        <button
          type="button"
          className={addPrefix('close')}
          aria-label="Close"
          onClick={createChainedFunction<(event: React.MouseEvent) => void>(
            onHide,
            context ? context.onModalHide : null
          )}
        >
          <span aria-hidden="true">&times;</span>
        </button>
      )}
    </ModalContext.Consumer>
  );

  return (
    <div {...props} className={classes}>
      {closeButton && buttonElement}
      {children}
    </div>
  );
}

ModalHeader.propTypes = {
  classPrefix: PropTypes.string,
  className: PropTypes.string,
  closeButton: PropTypes.bool,
  children: PropTypes.node,
  onHide: PropTypes.func
};

ModalHeader.defaultProps = {
  closeButton: true
};

export default defaultProps({
  classPrefix: 'modal-header'
})(ModalHeader);
