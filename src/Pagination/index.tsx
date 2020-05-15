import withLocale from '../IntlProvider/withLocale';
import Pagination, { PaginationProps } from './Pagination';

export default withLocale<PaginationProps>(['Pagination'])(Pagination);
export { PaginationProps };
