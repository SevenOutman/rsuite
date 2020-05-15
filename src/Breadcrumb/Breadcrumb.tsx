import * as React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import BreadcrumbItem from './BreadcrumbItem';
import { defaultProps, prefix, getUnhandledProps } from '../utils';

import { StandardProps } from '../@types/common';

export interface BreadcrumbProps extends StandardProps {
  /** Shorthand for primary content of the React.ReactNode */
  separator?: React.ReactNode;

  /** You can use a custom element for this component */
  componentClass?: React.ElementType;

  /** Primary content */
  children?: React.ReactNode;

  /**
   * Set the maximum number of breadcrumbs to display.
   * When there are more than the maximum number,
   * only the first and last will be shown, with an ellipsis in between.
   */
  maxItems?: number;

  /** A function to be called when you are in the collapsed view and click the ellipsis. */
  onExpand?: (event: React.MouseEvent) => void;
}

interface BreadcrumbState {
  ellipsis: boolean;
}

class Breadcrumb extends React.Component<BreadcrumbProps, BreadcrumbState> {
  static propTypes = {
    separator: PropTypes.node,
    componentClass: PropTypes.elementType,
    children: PropTypes.node,
    className: PropTypes.string,
    classPrefix: PropTypes.string,
    maxItems: PropTypes.number,
    onExpand: PropTypes.func
  };
  static defaultProps = {
    separator: '/',
    maxItems: 5
  };

  state = {
    ellipsis: true
  };

  addPrefix = (className: string) => prefix(this.props.classPrefix)(className);
  getSeparatorNode(key) {
    return (
      <li key={key} className={this.addPrefix('separator')}>
        {this.props.separator}
      </li>
    );
  }
  getCollapseItems(items, total) {
    if (total > this.props.maxItems && total > 2 && this.state.ellipsis) {
      return [
        items[0],
        items[1],
        [
          <BreadcrumbItem key="2" onClick={this.handleClickEllipsis}>
            <span>...</span>
          </BreadcrumbItem>
        ],
        items[items.length - 2],
        items[items.length - 1]
      ];
    }
    return items;
  }
  handleClickEllipsis = (event: React.MouseEvent) => {
    this.setState({ ellipsis: false });
    this.props.onExpand?.(event);
  };

  render() {
    const { classPrefix, componentClass: Component, className, children, ...rest } = this.props;
    const unhandledProps = getUnhandledProps(Breadcrumb, rest);
    const total = React.Children.count(children);
    const items = [];

    if (total) {
      React.Children.forEach(children, (item, index) => {
        items.push(item);
        if (index < total - 1) {
          items.push(this.getSeparatorNode(index));
        }
      });
    }

    return (
      <Component
        {...unhandledProps}
        role="navigation"
        aria-label="breadcrumbs"
        className={classNames(classPrefix, className)}
      >
        {this.getCollapseItems(items, total)}
      </Component>
    );
  }
}

export default defaultProps<BreadcrumbProps>({
  classPrefix: 'breadcrumb',
  componentClass: 'ol'
})(Breadcrumb);
