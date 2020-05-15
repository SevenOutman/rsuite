import * as React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import _ from 'lodash';
import { prefix, defaultProps } from '../utils';
import { overlayProps } from '../Whisper/Whisper';
import { StandardProps, TypeAttributes } from '../@types/common';

export interface TooltipProps extends StandardProps {
  /** Dispaly placement */
  placement?: TypeAttributes.Placement;

  /** Wheather visible */
  visible?: boolean;

  /** Primary content */
  children?: React.ReactNode;
}

class Tooltip extends React.Component<TooltipProps> {
  static propTypes = {
    visible: PropTypes.bool,
    classPrefix: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
    children: PropTypes.node
  };
  render() {
    const {
      className,
      classPrefix,
      children,
      style,
      visible,
      htmlElementRef,
      ...rest
    } = this.props;

    const addPrefix = prefix(classPrefix);
    const classes = classNames(classPrefix, className);
    const styles = {
      opacity: visible ? 1 : undefined,
      ...style
    };

    return (
      <div
        {..._.omit(rest, overlayProps)}
        role="tooltip"
        className={classes}
        style={styles}
        ref={htmlElementRef}
      >
        <div className={addPrefix('arrow')} />
        <div className={addPrefix('inner')}>{children}</div>
      </div>
    );
  }
}

export default defaultProps<TooltipProps>({
  classPrefix: 'tooltip'
})(Tooltip);
