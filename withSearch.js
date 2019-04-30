// @flow

import * as React from 'react';
import { SearchItemType } from '../components/BasicTable/utils';
import { getDisplayName } from './utils';

type Props = {
    items: Array<SearchItemType>,
    searchText: string,
};

/**
 * Adds search logic, searches and returns matched items.
 * The wrapped components is responsible for search field rendering.
 * Should be applied after  pagination HOCs,
 * as pagination filter should be last to filter items.
 * Item should be of SearchItemType type => have searchPattern field.
 */
export const withSearch = (
    WrappedComponent: React.Element<any>,
    wrappedComponentItemsPropertyName: string,
    wrappedComponentSearchTextPropertyName: string,
): React.Element<any> => {
    class WithSearch extends React.Component<Props> {
        static defaultProps = {
            items: [],
        };

        search = (
            items: Array<SearchItemType> = [],
            searchText: string = ''
        ): Array<SearchItemType> => {
            let foundItems = items;
            if (items.length && typeof searchText === 'string') {
                foundItems = foundItems.filter(({ searchPattern = '' }) =>
                    searchPattern.indexOf(searchText.toLowerCase()) >= 0);
            }

            return foundItems;
        };

        render () {
            const { items, searchText, ...other } = this.props;
            const fountItems = this.search(items, searchText);
            const props = {
                [wrappedComponentItemsPropertyName]: fountItems,
                [wrappedComponentSearchTextPropertyName]: searchText,
            };
            return (
                <WrappedComponent
                    {...props}
                    {...other}
                />
            );
        }
    }

    WithSearch.displayName = `WithSearch(${getDisplayName(WrappedComponent)})`;
    return WithSearch;
};
