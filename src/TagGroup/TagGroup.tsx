import * as React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { defaultProps } from '../utils';
import { StandardProps } from '../@types/common';

export interface TagGroupProps extends StandardProps {
  /** The content of the component */
  children?: React.ReactNode;
}

class TagGroup extends React.Component<TagGroupProps> {
  static propTypes = {
    className: PropTypes.string,
    classPrefix: PropTypes.string,
    children: PropTypes.node
  };
  render() {
    const { className, classPrefix, children, ...rest } = this.props;
    const classes = classNames(classPrefix, className);
    return (
      <div {...rest} className={classes}>
        {children}
      </div>
    );
  }
}

export default defaultProps<TagGroupProps>({
  classPrefix: 'tag-group'
})(TagGroup);
