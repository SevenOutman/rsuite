import * as React from 'react';
import PropTypes from 'prop-types';
import OverlayTrigger from '../Overlay/OverlayTrigger';
import { createChainedFunction, placementPolyfill, refType } from '../utils';
import IntlContext from '../IntlProvider/IntlContext';
import { TriggerProps } from '../Overlay/OverlayTrigger.d';
import { TooltipProps } from '../Tooltip';
import { PopoverProps } from '../Popover';

export const overlayProps = [
  'placement',
  'shouldUpdatePosition',
  'arrowOffsetLeft',
  'arrowOffsetTop',
  'positionLeft',
  'positionTop'
];

export interface WhisperProps extends TriggerProps {
  /** display element */
  speaker?:
    | React.ReactElement<TooltipProps | PopoverProps>
    | ((props: any, ref: React.RefObject<any>) => React.ReactElement);
}

class Whisper extends React.Component<WhisperProps> {
  static propTypes = {
    triggerRef: refType,
    onOpen: PropTypes.func,
    onClose: PropTypes.func,
    onEntered: PropTypes.func,
    onExited: PropTypes.func,
    placement: PropTypes.string,
    /**
     * Prevent floating element overflow
     */
    preventOverflow: PropTypes.bool
  };
  render() {
    const {
      triggerRef,
      onOpen,
      onClose,
      onEntered,
      onExited,
      placement = 'right',
      preventOverflow,
      ...rest
    } = this.props;

    return (
      <IntlContext.Consumer>
        {context => (
          <OverlayTrigger
            preventOverflow={preventOverflow}
            placement={placementPolyfill(placement, context?.rtl)}
            onEntered={createChainedFunction(onOpen, onEntered)}
            onExited={createChainedFunction(onClose, onExited)}
            ref={triggerRef} // for test
            {...rest}
          />
        )}
      </IntlContext.Consumer>
    );
  }
}

export default Whisper;
