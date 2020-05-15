import Slider, { SliderProps } from './Slider';
import withLocale from '../IntlProvider/withLocale';

export default withLocale<SliderProps>([])(Slider);
export { SliderProps };
