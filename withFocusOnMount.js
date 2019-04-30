// @flow

import * as React from 'react';
import { getDisplayName } from './utils';

export const withFocusOnMount = (
    WrappedComponent: React.Element<any>,
    focusElementSelector: string,
): React.Element<any> => {
    class WithFocusOnMount extends React.Component {
        componentDidMount (): void {
            const element = document.querySelector(focusElementSelector);
            if (element && element.focus) {
                element.focus();
            }
        }

        render () {
            return (<WrappedComponent {...this.props} />);
        }
    }

    WithFocusOnMount.displayName = `WithFocusOnMount(${getDisplayName(WrappedComponent)})`;
    return WithFocusOnMount;
};
