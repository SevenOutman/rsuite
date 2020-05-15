import * as React from 'react';
import ReactDOM from 'react-dom';
import { getContainer, ownerDocument } from 'dom-lib';

export interface PortalProps {
  /**
   * A Node, Component instance, or function that returns either.
   * The `container` will have the Portal children
   * appended to it.
   */
  container?: HTMLElement | (() => HTMLElement);

  /** Rendered callback function */
  onRendered?: () => void;

  /** Primary content */
  children?: React.ReactNode;
}

class Portal extends React.Component<PortalProps> {
  static displayName = 'Portal';
  portalContainerNode = null;

  componentDidMount() {
    this.setContainer();
    this.forceUpdate(this.props.onRendered);
  }

  shouldComponentUpdate(nextProps: PortalProps) {
    if (nextProps.container !== this.props.container) {
      this.setContainer();
    }

    if (nextProps != this.props) {
      return true;
    }

    return false;
  }

  componentWillUnmount() {
    this.portalContainerNode = null;
  }

  setContainer = (props: PortalProps = this.props) => {
    this.portalContainerNode = getContainer(props.container, ownerDocument(this).body);
  };

  getMountNode = () => this.portalContainerNode;

  render() {
    const { children } = this.props;
    return children && this.portalContainerNode
      ? ReactDOM.createPortal(children, this.portalContainerNode)
      : null;
  }
}

export default Portal;
