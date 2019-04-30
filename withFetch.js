// @flow

import * as React from 'react';
import { getDisplayName } from './utils';

type Props = {
    /** Function is called on componentDidMount !Must return Promise! */
    fetch: () => Promise,
    /** If request failed will stop polling */
    fetchFailed: boolean,
};

/**
 * Calls fetcher on mount, polling if specified.
 * @param WrappedComponent.
 * @param poll - Should poll.
 * @param timeout - Poll interval in seconds (default 60).
 */
export const withFetch = (
    WrappedComponent: React.Element<any>,
    poll: boolean,
    timeout: number = 60,
): React.Element<any> => {
    class WithFetch extends React.Component<Props> {
        static defaultProps = {
            fetch: () => Promise.resolve(),
        };


        componentDidMount (): void {
            this.start();
        }

        componentWillUnmount (): void {
            this.isLeaving = true;
            if (this.timeoutId) {
                clearTimeout(this.timeoutId);
            }
        }

        start = async () => {
            try {
                await this.props.fetch();
                if (
                    poll
                    && !this.isLeaving
                    && !this.props.fetchFailed
                    && !isNaN(timeout)
                    && timeout > 0
                ) {
                    this.timeoutId = setTimeout(this.start, timeout * 1000);
                }
            } catch (e) {
                console.log(e);
            }
        };

        render () {
            const { fetch, fetchFailed, ...other } = this.props;
            return (
                <WrappedComponent {...other} />
            );
        }
    }

    WithFetch.displayName = `WithPoll(${getDisplayName(WrappedComponent)})`;
    return WithFetch;
};
