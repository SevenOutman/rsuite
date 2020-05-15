import * as React from 'react';
import PropTypes from 'prop-types';

export interface SafeAnchorProps {
  /** Link specified url */
  href?: string;

  /** A link can show it is currently unable to be interacted with */
  disabled?: boolean;

  /** A link can receive focus */
  tabIndex?: number | string;

  /** You can use a custom element for this component */
  componentClass?: React.ElementType<any>;

  onClick?: (event: React.MouseEvent) => void;

  [key: string]: any;
}

const SafeAnchor: React.FunctionComponent = React.forwardRef<'SafeAnchor', SafeAnchorProps>(
  (props, ref) => {
    const { componentClass: Component = 'a', disabled, ...rest } = props;
    const handleClick = (event: React.MouseEvent) => {
      if (disabled) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }

      rest.onClick?.(event);
    };

    if (disabled) {
      rest.tabIndex = -1;
      rest['aria-disabled'] = true;
    }

    return <Component ref={ref} {...rest} onClick={handleClick} />;
  }
);

SafeAnchor.displayName = 'SafeAnchor';
SafeAnchor.propTypes = {
  disabled: PropTypes.bool,
  componentClass: PropTypes.elementType
};

export default SafeAnchor;
