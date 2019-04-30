import * as React from 'react';

/** Auto focus hoc for dom node components. */
export const withAutoFocus = Component =>
    class Wrapper extends React.Component {
        constructor (props) {
            super(props);
            this.rootNode = React.createRef();
        }

        componentDidMount () {
            const { rootNode: { current = {} } = {} } = this;

            if (typeof current.focus === 'function') {
                current.focus();
            }
        }

        render () {
            return React.createElement(Component, { ...this.props, ref: this.rootNode });
        }
    };
