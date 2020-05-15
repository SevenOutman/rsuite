import * as React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { defaultProps } from '../utils';
import { StandardProps } from '../@types/common';

export interface ContentProps extends StandardProps {
  /** Primary content */
  children?: React.ReactNode;
}

function Content({ className, classPrefix, ...props }: ContentProps) {
  const classes = classNames(classPrefix, className);
  return <div {...props} className={classes} />;
}

Content.propTypes = {
  className: PropTypes.string,
  classPrefix: PropTypes.string
};

export default defaultProps<ContentProps>({
  classPrefix: 'content'
})(Content);
