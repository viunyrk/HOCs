import * as React from 'react';
import enhanceWithClickOutside from 'react-click-outside';

export const withOnClickOutside = Component => enhanceWithClickOutside(
    class Wrapper extends React.Component {
        static defaultProps = {
            onClickOutside: () => {
            },
        };

        handleClickOutside () {
            this.props.onClickOutside();
        }

        render () {
            const { onClickOutside, ...componentProps } = this.props;
            return <Component {...componentProps} />;
        }
    }
);
