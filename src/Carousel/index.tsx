import Carousel, { CarouselProps } from './Carousel';
import withLocale from '../IntlProvider/withLocale';

export default withLocale<CarouselProps>([])(Carousel);
export { CarouselProps };
