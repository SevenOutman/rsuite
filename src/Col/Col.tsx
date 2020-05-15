import * as React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import _ from 'lodash';

import { defaultClassPrefix, prefix, defaultProps } from '../utils';

import { StandardProps } from '../@types/common';
import { SIZE } from '../constants';

const omitKeys = {};

const getValue = _.curry((obj: any, key: string): number => {
  omitKeys[key] = null;
  return obj[key];
});

export interface ColProps extends StandardProps {
  /** You can use a custom element for this component */
  componentClass?: React.ElementType;

  /** The number of columns you wish to span for Extra small devices Phones (< 480px) */
  xs?: number;

  /** The number of columns you wish to span for Small devices Tablets (≥ 480px) */
  sm?: number;

  /** The number of columns you wish to span for Medium devices Desktops (≥ 992px) */
  md?: number;

  /** The number of columns you wish to span for Large devices Desktops (≥ 1200px) */
  lg?: number;

  /** Move columns to the right for Extra small devices Phones */
  xsOffset?: number;

  /** Move columns to the right for Small devices Tablets */
  smOffset?: number;

  /** Move columns to the right for Medium devices Desktops */
  mdOffset?: number;

  /** Move columns to the right for Medium devices Desktops */
  lgOffset?: number;

  /** Change the order of grid columns to the right for Extra small devices Phones */
  xsPush?: number;

  /** Change the order of grid columns to the right for Small devices Tablets */
  smPush?: number;

  /** Change the order of grid columns to the right for Medium devices Desktops */
  mdPush?: number;

  /** Change the order of grid columns to the right for Large devices Desktops */
  lgPush?: number;

  /** Change the order of grid columns to the left for Extra small devices Phones */
  xsPull?: number;

  /** Change the order of grid columns to the left for Small devices Tablets */
  smPull?: number;

  /** Change the order of grid columns to the left for Medium devices Desktops */
  mdPull?: number;

  /** Change the order of grid columns to the left for Large devices Desktops */
  lgPull?: number;

  /** Hide column on Extra small devices Phones */
  xsHidden?: boolean;

  /** Hide column on Small devices Tablets */
  smHidden?: boolean;

  /** Hide column on Medium devices Desktops */
  mdHidden?: boolean;

  /** Hide column on Large devices Desktops */
  lgHidden?: boolean;
}

function Col({ className, componentClass: Component, classPrefix, ...props }: ColProps) {
  const addPrefix = prefix(classPrefix);
  const classes = {};
  const getPropValue = getValue(this.props);

  SIZE.forEach(size => {
    const col = getPropValue(size);
    const hidden = getPropValue(`${size}Hidden`);
    const offset = getPropValue(`${size}Offset`);
    const push = getPropValue(`${size}Push`);
    const pull = getPropValue(`${size}Pull`);

    classes[defaultClassPrefix(`hidden-${size}`)] = hidden;
    classes[addPrefix(`${size}-${col}`)] = col >= 0;
    classes[addPrefix(`${size}-offset-${offset}`)] = offset >= 0;
    classes[addPrefix(`${size}-push-${push}`)] = push >= 0;
    classes[addPrefix(`${size}-pull-${pull}`)] = pull >= 0;
  });

  const elementProps = _.omit(props, Object.keys(omitKeys));

  return <Component {...elementProps} className={classNames(className, classPrefix, classes)} />;
}

Col.propTypes = {
  className: PropTypes.string,
  classPrefix: PropTypes.string,

  xs: PropTypes.number,
  sm: PropTypes.number,
  md: PropTypes.number,
  lg: PropTypes.number,

  xsOffset: PropTypes.number,
  smOffset: PropTypes.number,
  mdOffset: PropTypes.number,
  lgOffset: PropTypes.number,

  xsPush: PropTypes.number,
  smPush: PropTypes.number,
  mdPush: PropTypes.number,
  lgPush: PropTypes.number,
  xsPull: PropTypes.number,
  smPull: PropTypes.number,
  mdPull: PropTypes.number,
  lgPull: PropTypes.number,

  xsHidden: PropTypes.bool,
  smHidden: PropTypes.bool,
  mdHidden: PropTypes.bool,
  lgHidden: PropTypes.bool,

  componentClass: PropTypes.elementType
};

export default defaultProps<ColProps>({
  classPrefix: 'col',
  componentClass: 'div'
})(Col);
