// @flow

import * as React from 'react';
import type { BasicItemType, SortDirectionType, Comparator } from '../components/BasicTable/utils';
import { getDisplayName } from './utils';

type Props = {
    items: Array<BasicItemType>,
    sortDirection: SortDirectionType,
    comparator: Comparator,
};

/**
 * Adds sort logic, returns sorted items.
 * The wrapped components is responsible for sort view render.
 * Should be applied after  pagination HOCs,
 * as pagination filter should be last to touch items.
 */
export const withSort = (
    WrappedComponent: React.Element<any>,
    wrappedComponentItemsPropertyName: string,
    wrappedComponentSortDirectionPropertyName: string,
): React.Element<any> => {
    class WithSort extends React.Component<Props> {
        static defaultProps = {
            items: [],
        };

        sort = (
            items: Array<BasicItemType> = [],
            comparator: Comparator,
            sortDirection: SortDirectionType,
        ): Array<Object> => {
            if (!items.length || !sortDirection || !comparator) {
                return items;
            }

            const documentsToSort = [...items];
            documentsToSort.sort(comparator[sortDirection]);

            return documentsToSort;
        };

        render () {
            const { items, sortDirection, comparator, ...other } = this.props;
            const sortedItems = this.sort(items, comparator, sortDirection);
            const props = {
                [wrappedComponentItemsPropertyName]: sortedItems,
                [wrappedComponentSortDirectionPropertyName]: sortDirection,
            };
            return (
                <WrappedComponent
                    {...props}
                    {...other}
                />
            );
        }
    }

    WithSort.displayName = `WithSort(${getDisplayName(WrappedComponent)})`;
    return WithSort;
};
