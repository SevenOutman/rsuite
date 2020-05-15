import * as React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import SafeAnchor from '../SafeAnchor';
import { defaultProps, prefix } from '../utils';

import { StandardProps } from '../@types/common';

export interface BreadcrumbItemProps extends StandardProps {
  // Style as the currently active section
  active?: boolean;

  // Render as an `a` tag instead of a `div` and adds the href attribute
  href?: string;

  // Display title.
  title?: string;

  // The target attribute specifies where to open the linked document
  target?: string;

  // You can use a custom element for this component
  componentClass?: React.ElementType;

  /** Primary content */
  children?: React.ReactNode;

  /** Custom rendering item */
  renderItem?: (item: React.ReactNode) => React.ReactNode;
}

function BreadcrumbItem({
  href,
  classPrefix,
  title,
  target,
  componentClass: Component,
  className,
  style,
  active,
  renderItem,
  ...rest
}: BreadcrumbItemProps) {
  const addPrefix = prefix(classPrefix);

  const linkProps = { href, title, target };
  const classes = classNames(classPrefix, className, {
    [addPrefix('active')]: active
  });

  let item: React.ReactNode = <Component {...rest} {...linkProps} />;
  if (renderItem) {
    item = renderItem(item);
  }

  return (
    <li style={style} className={classes}>
      {active ? <span {...rest} /> : item}
    </li>
  );
}

BreadcrumbItem.propTypes = {
  active: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.object,
  href: PropTypes.string,
  title: PropTypes.string,
  target: PropTypes.string,
  classPrefix: PropTypes.string,
  componentClass: PropTypes.elementType,
  renderItem: PropTypes.func
};

export default defaultProps<BreadcrumbItemProps>({
  classPrefix: 'breadcrumb-item',
  componentClass: SafeAnchor
})(BreadcrumbItem);
