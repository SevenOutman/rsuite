import * as React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import IconButton from '../IconButton';
import Icon from '../Icon';
import { defaultProps } from '../utils';
import { StandardProps } from '../@types/common';

export interface SidenavToggleProps extends StandardProps {
  /** Expand then nav */
  expanded?: boolean;

  /** Callback function for menu state switching */
  onToggle?: (expanded: boolean, event: React.SyntheticEvent<HTMLButtonElement>) => void;
}

class SidenavToggle extends React.Component<SidenavToggleProps> {
  static propTypes = {
    classPrefix: PropTypes.string,
    className: PropTypes.string,
    expanded: PropTypes.bool,
    onToggle: PropTypes.func
  };
  handleToggle = (event: React.SyntheticEvent<HTMLButtonElement>) => {
    const { onToggle, expanded } = this.props;
    onToggle?.(!expanded, event);
  };

  render() {
    const { expanded, className, classPrefix, ...props } = this.props;
    const classes = classNames(classPrefix, className, {
      collapsed: !expanded
    });

    return (
      <div {...props} className={classes}>
        <IconButton
          appearance="default"
          icon={<Icon icon={expanded ? 'angle-right' : 'angle-left'} />}
          onClick={this.handleToggle}
        />
      </div>
    );
  }
}

export default defaultProps<SidenavToggleProps>({
  classPrefix: 'sidenav-toggle'
})(SidenavToggle);
