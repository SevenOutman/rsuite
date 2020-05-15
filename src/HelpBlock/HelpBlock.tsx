import * as React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Tooltip from '../Tooltip';
import Whisper from '../Whisper';
import Icon from '../Icon';
import { defaultProps, prefix } from '../utils';
import { StandardProps } from '../@types/common';

export interface HelpBlockProps extends StandardProps {
  /** Primary content */
  children?: React.ReactNode;

  /** Whether to show through the Tooltip component */
  tooltip?: boolean;
}

function HelpBlock({ className, tooltip, children, classPrefix, ...props }: HelpBlockProps) {
  const addPrefix = prefix(classPrefix);
  const classes = classNames(classPrefix, className, {
    [addPrefix('tooltip')]: tooltip
  });

  if (tooltip) {
    return (
      <Whisper placement="topEnd" speaker={<Tooltip>{children}</Tooltip>}>
        <span className={classes} {...props}>
          <Icon icon="question-circle2" />
        </span>
      </Whisper>
    );
  }

  return (
    <span {...props} className={classes}>
      {children}
    </span>
  );
}

HelpBlock.propTypes = {
  className: PropTypes.string,
  tooltip: PropTypes.bool,
  children: PropTypes.node,
  classPrefix: PropTypes.string
};

export default defaultProps<HelpBlockProps>({
  classPrefix: 'help-block'
})(HelpBlock);
