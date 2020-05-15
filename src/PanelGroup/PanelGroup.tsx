import * as React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import classNames from 'classnames';
import { ReactChildren, getUnhandledProps, defaultProps, prefix } from '../utils';
import { PanelProps } from '../Panel';
import { StandardProps } from '../@types/common';

export interface PanelGroupProps<T = any> extends StandardProps {
  /** Whether it is a collapsible panel. */
  accordion?: boolean;

  /** Expand the Panel, corresponding to the 'Panel' of 'eventkey' */
  activeKey?: T;

  /** Show border */
  bordered?: boolean;

  /** The default expansion panel. */
  defaultActiveKey?: T;

  /** Primary content */
  children?: React.ReactNode;

  /** Toggles the callback function for the expand panel */
  onSelect?: (eventKey: T, event: React.SyntheticEvent<any>) => void;
}

interface PanelGroupState {
  activeKey?: boolean;
}

class PanelGroup extends React.Component<PanelGroupProps, PanelGroupState> {
  static propTypes = {
    accordion: PropTypes.bool,
    activeKey: PropTypes.any,
    bordered: PropTypes.bool,
    defaultActiveKey: PropTypes.any,
    className: PropTypes.string,
    children: PropTypes.node,
    classPrefix: PropTypes.string,
    onSelect: PropTypes.func
  };
  constructor(props) {
    super(props);
    this.state = {
      activeKey: props.defaultActiveKey
    };
  }

  getActiveKey() {
    const { activeKey } = this.props;
    return _.isUndefined(activeKey) ? this.state.activeKey : activeKey;
  }

  handleSelect = (activeKey: any, event: React.MouseEvent) => {
    this.setState({ activeKey });
    this.props.onSelect?.(activeKey, event);
  };

  addPrefix = (name: string) => prefix(this.props.classPrefix)(name);

  renderPanel = (child: React.ReactElement<PanelProps>, index: number) => {
    if (!React.isValidElement(child)) {
      return child;
    }
    const { accordion } = this.props;
    const activeKey = this.getActiveKey();
    const props: PanelProps = {
      key: child.key ? child.key : index,
      ref: _.get(child, 'ref')
    };

    if (accordion) {
      return {
        ...props,
        headerRole: 'tab',
        panelRole: 'tabpanel',
        collapsible: true,
        expanded: _.isUndefined(activeKey)
          ? child.props.expanded
          : child.props.eventKey === activeKey,
        onSelect: this.handleSelect
      };
    }

    return props;
  };

  render() {
    const { className, accordion, bordered, classPrefix, children, ...rest } = this.props;
    const classes = classNames(classPrefix, className, {
      [this.addPrefix('accordion')]: accordion,
      [this.addPrefix('bordered')]: bordered
    });

    const unhandled = getUnhandledProps(PanelGroup, rest);

    return (
      <div {...unhandled} role={accordion ? 'tablist' : undefined} className={classes}>
        {ReactChildren.mapCloneElement(children, this.renderPanel)}
      </div>
    );
  }
}

export default defaultProps<PanelGroupProps>({
  classPrefix: 'panel-group'
})(PanelGroup);
