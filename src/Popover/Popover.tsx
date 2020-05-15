import * as React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import _ from 'lodash';
import { prefix, defaultProps } from '../utils';
import { overlayProps } from '../Whisper/Whisper';
import { StandardProps } from '../@types/common';

export interface PopoverProps extends StandardProps {
  /** Primary content */
  children?: React.ReactNode;

  /** The title of the component. */
  title?: React.ReactNode;
}

function Popover({
  classPrefix,
  title,
  children,
  style,
  visible,
  className,
  full,
  htmlElementRef,
  ...rest
}: PopoverProps) {
  const addPrefix = prefix(classPrefix);
  const classes = classNames(classPrefix, className, {
    [addPrefix('full')]: full
  });

  const styles = {
    display: 'block',
    opacity: visible ? 1 : undefined,
    ...style
  };

  return (
    <div {..._.omit(rest, overlayProps)} className={classes} style={styles} ref={htmlElementRef}>
      <div className={addPrefix('arrow')} />
      {title ? <h3 className={addPrefix('title')}>{title}</h3> : null}
      <div className={addPrefix('content')}>{children}</div>
    </div>
  );
}

Popover.propTypes = {
  classPrefix: PropTypes.string,
  children: PropTypes.node,
  title: PropTypes.node,
  style: PropTypes.object,
  visible: PropTypes.bool,
  className: PropTypes.string,
  full: PropTypes.bool
};

export default defaultProps<PopoverProps>({
  classPrefix: 'popover'
})(Popover);
