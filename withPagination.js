// @flow

import * as React from 'react';
import { BasicItemType } from '../components/BasicTable/utils';
import { getDisplayName } from './utils';

type Props = {
    items: Array<BasicItemType>,
    currentPage: number,
    pageSize: number,
};

/**
 * Adds pagination logic, filters and returns current page items.
 * The wrapped components is responsible for pagination rendering.
 * Should be applied before search/sort/filter HOCs,
 * as pagination filter should be last to filter items.
 */
export const withPagination = (
    WrappedComponent: React.Element<any>,
    wrappedComponentItemsPropertyName: string,
    wrappedComponentCurrentPagePropertyName: string,
    wrappedComponentPageSizePropertyName: string,
    wrappedComponentItemsTotalPropertyName: string,
): React.Element<any> => {
    class WithPagination extends React.Component<Props> {
        static defaultProps = {
            items: [],
            pageSize: 25,
        };

        paginate = (
            items: Array<BasicItemType> = [],
            currentPage: number = 1,
            pageSize: number,
        ) => {
            let end = currentPage * pageSize;
            if (end > items.length) {
                // last el of page
                end = items.length;
            }
            // first el of page
            const start = (currentPage - 1) * pageSize + 1;

            return items.slice(start - 1, end);
        };

        render () {
            const { items = [], currentPage, pageSize, ...other } = this.props;
            const paginatedItems = this.paginate(items, currentPage, pageSize);
            const props = {
                [wrappedComponentItemsPropertyName]: paginatedItems,
                [wrappedComponentCurrentPagePropertyName]: currentPage,
                [wrappedComponentPageSizePropertyName]: pageSize,
                [wrappedComponentItemsTotalPropertyName]: items.length,
            };
            return (
                <WrappedComponent
                    {...props}
                    {...other}
                />
            );
        }
    }

    WithPagination.displayName = `WithPagination(${getDisplayName(WrappedComponent)})`;
    return WithPagination;
};
