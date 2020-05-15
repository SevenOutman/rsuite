/**
 * placementPolyfill('bottomLeft');
 * output 'bottomStart'
 */

function placementPolyfill<T extends string = string>(placement: T, rtl = false): T {
  if (typeof placement === 'string') {
    if (rtl) {
      placement = placement.replace(/left|right/, m => (m === 'left' ? 'right' : 'left')) as T;
    }
    return (placement.replace(/Left|Top/, 'Start').replace(/Right|Bottom/, 'End') as unknown) as T;
  }
  return placement;
}

export default placementPolyfill;
