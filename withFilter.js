// @flow

import * as React from 'react';
import { getDisplayName } from './utils';
import type { BasicItemType } from '../components/BasicTable/utils';
import type { FilterType } from '../components/Filter/utils';
import { observer } from 'mobx-react';

type Props = {
    items: Array<BasicItemType>,
    filters: { [id: string]: FilterType },
};

/**
 * Adds filter logic, filters and returns matched items.
 * The wrapped components is responsible for filters rendering.
 * Should be applied after  pagination HOCs,
 * as pagination filter should be last to filter items.
 */
export const withFilter = (
    WrappedComponent: React.Element<any>,
    wrappedComponentItemsPropertyName: string,
    wrappedComponentFiltersPropertyName: string,
): React.Element<any> => {
    @observer
    class WithFilter extends React.Component<Props> {
        static defaultProps = {
            items: [],
        };

        filter = (
            items: Array<BasicItemType> = [],
            filters: { [id: string]: FilterType },
        ): Array<BasicItemType> => {
            const filterItems = Object.keys(filters);
            let foundItems = items;
            if (items.length && filterItems.length) {
                filterItems.forEach(key => {
                    const filter = filters[key] || {};
                    if (filter.isValid && filter.isValid()) {
                        foundItems = foundItems.filter(item => filter.pass(item));
                    }
                });
            }

            return foundItems;
        };

        render () {
            const { items, filters, ...other } = this.props;
            const foundItems = this.filter(items, filters);
            const props = {
                [wrappedComponentItemsPropertyName]: foundItems,
                // passing down filters for render purposes
                [wrappedComponentFiltersPropertyName]: filters,
            };
            return (
                <WrappedComponent
                    {...props}
                    {...other}
                />
            );
        }
    }

    WithFilter.displayName = `WithFilter(${getDisplayName(WrappedComponent)})`;
    return WithFilter;
};
