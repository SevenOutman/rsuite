import * as React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Slide from '../Animation/Slide';
import Modal, { ModalProps } from '../Modal';

import { prefix, defaultProps } from '../utils';
import { TypeAttributes } from '../@types/common';

export interface DrawerProps extends ModalProps {
  /** The placement of Drawer */
  placement?: TypeAttributes.Placement4;
}

function Drawer({ show, full, className, placement, classPrefix, ...props }: DrawerProps) {
  this.props;
  const addPrefix = prefix(classPrefix);
  const classes = classNames(addPrefix(placement), className, {
    [addPrefix('full')]: full
  });

  const animationProps = {
    placement
  };

  return (
    <Modal
      {...props}
      drawer
      classPrefix={classPrefix}
      className={classes}
      show={show}
      animation={Slide}
      animationProps={animationProps}
    />
  );
}

Drawer.propTypes = {
  classPrefix: PropTypes.string,
  placement: PropTypes.oneOf(['top', 'right', 'bottom', 'left']),
  show: PropTypes.bool,
  full: PropTypes.bool,
  children: PropTypes.node,
  className: PropTypes.string
};

Drawer.defaultProps = {
  placement: 'right'
};

const EnhancedDrawer = defaultProps<DrawerProps>({
  classPrefix: 'drawer'
})(Drawer);

export default EnhancedDrawer;
