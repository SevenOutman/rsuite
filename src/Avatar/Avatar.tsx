import * as React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import compose from 'recompose/compose';
import { defaultProps, prefix, withStyleProps } from '../utils';
import { SIZE } from '../constants';
import { StandardProps, TypeAttributes } from '../@types/common';

export interface AvatarProps extends StandardProps {
  /** The content of the wrapped */
  children?: React.ReactNode;

  /** A avatar can have different sizes */
  size?: TypeAttributes.Size;

  /** Image src */
  src?: string;

  /** Set avatar shape to circle  */
  circle?: boolean;

  /** This attribute defines an alternative text description of the image */
  alt?: string;
}

function Avatar({ classPrefix, className, children, src, circle, alt, ...rest }: AvatarProps) {
  const addPrefix = prefix(classPrefix);
  const classes = classNames(classPrefix, className, {
    [addPrefix('circle')]: circle
  });

  return (
    <div {...rest} className={classes}>
      {src ? <img className={addPrefix('image')} src={src} alt={alt} /> : children}
    </div>
  );
}

Avatar.propTypes = {
  classPrefix: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node,
  size: PropTypes.oneOf<AvatarProps['size']>(SIZE),
  src: PropTypes.string,
  circle: PropTypes.bool,
  alt: PropTypes.string
};

export default compose<AvatarProps, AvatarProps>(
  withStyleProps<AvatarProps>({
    hasSize: true
  }),
  defaultProps<AvatarProps>({
    classPrefix: 'avatar'
  })
)(Avatar);
