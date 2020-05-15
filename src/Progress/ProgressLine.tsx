import * as React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { prefix, defaultProps, getUnhandledProps } from '../utils';
import { StandardProps } from '../@types/common';

export interface ProgressLineProps extends StandardProps {
  /** Line color */
  strokeColor?: string;

  /** Percent of progress */
  percent?: number;

  /** Line width */
  strokeWidth?: number;

  /** Trail color */
  trailColor?: string;

  /** Trail width */
  trailWidth?: number;

  /** Show text */
  showInfo?: boolean;

  /** Progress status */
  status?: 'success' | 'fail' | 'active';

  /**  The progress bar is displayed vertically */
  vertical?: boolean;
}

class ProgressLine extends React.Component<ProgressLineProps> {
  static propTypes = {
    className: PropTypes.string,
    classPrefix: PropTypes.string,
    percent: PropTypes.number,
    strokeColor: PropTypes.string,
    strokeWidth: PropTypes.number,
    trailColor: PropTypes.string,
    trailWidth: PropTypes.number,
    showInfo: PropTypes.bool,
    vertical: PropTypes.bool,
    status: PropTypes.oneOf<ProgressLineProps['status']>(['success', 'fail', 'active'])
  };
  static defaultProps = {
    showInfo: true,
    percent: 0
  };

  render() {
    const {
      className,
      percent,
      strokeColor,
      strokeWidth,
      trailColor,
      trailWidth,
      status,
      showInfo,
      classPrefix,
      vertical,
      ...rest
    } = this.props;

    const addPrefix = prefix(classPrefix);
    const unhandled = getUnhandledProps(ProgressLine, rest);
    const lineInnerStyle = {
      backgroundColor: trailColor,
      [vertical ? 'width' : 'height']: trailWidth || strokeWidth
    };
    const percentStyle = {
      [vertical ? 'height' : 'width']: `${percent}%`,
      backgroundColor: strokeColor,
      [vertical ? 'width' : 'height']: strokeWidth
    };

    const classes = classNames(classPrefix, addPrefix('line'), className, {
      [addPrefix('line-vertical')]: vertical,
      [addPrefix(`line-${status || ''}`)]: !!status
    });

    const showIcon = status && status !== 'active';
    const info = showIcon ? (
      <span className={addPrefix(`icon-${status || ''}`)} />
    ) : (
      <span className={addPrefix('info-status')}>{percent}%</span>
    );

    return (
      <div className={classes} {...unhandled}>
        <div className={addPrefix('line-outer')}>
          <div className={addPrefix('line-inner')} style={lineInnerStyle}>
            <div className={addPrefix('line-bg')} style={percentStyle} />
          </div>
        </div>
        {showInfo ? <div className={addPrefix('info')}>{info}</div> : null}
      </div>
    );
  }
}

export default defaultProps<ProgressLineProps>({
  classPrefix: 'progress'
})(ProgressLine);
