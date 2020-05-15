import * as React from 'react';
import PropTypes from 'prop-types';
import { defaultProps, prefix } from '../utils';
import classNames from 'classnames';
import { StandardProps } from '../@types/common';

export interface BadgeProps extends StandardProps {
  /** The content of the wrapped */
  children?: React.ReactNode;

  /** Main content */
  content?: React.ReactNode;

  /** Max count */
  maxCount?: number;
}

function Badge({
  className,
  classPrefix,
  children,
  content: contentText,
  maxCount,
  ...rest
}: BadgeProps) {
  const addPrefix: (className: string) => string = prefix(classPrefix);
  const dot = contentText === undefined || contentText === null;
  const classes: string = classNames(classPrefix, className, {
    [addPrefix('independent')]: !children,
    [addPrefix('wrapper')]: children,
    [addPrefix('dot')]: dot
  });

  if (contentText === false) {
    return children;
  }

  const content =
    // $FlowFixMe I'm sure contenxtText is number type and maxCount is number type.
    typeof contentText === 'number' && contentText > maxCount ? `${maxCount}+` : contentText;
  if (!children) {
    return (
      <div {...rest} className={classes}>
        {content}
      </div>
    );
  }
  return (
    <div {...rest} className={classes}>
      {children}
      <div className={addPrefix('content')}>{content}</div>
    </div>
  );
}

Badge.propTypes = {
  className: PropTypes.string,
  classPrefix: PropTypes.string,
  children: PropTypes.node,
  content: PropTypes.oneOfType([PropTypes.node, PropTypes.bool]),
  maxCount: PropTypes.number
};

Badge.defaultProps = {
  maxCount: 99
};

export default defaultProps<BadgeProps>({
  classPrefix: 'badge'
})(Badge);
