import React from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';
import { makeStyles } from '@material-ui/core/styles';
import { PACKAGE } from './const';

function Log(props) {
    const useToolbarStyles = makeStyles(theme => ({
        rootLinear: {
            width: '100%',
            position: 'sticky',
            top: '0px',
            zIndex: '1',
            margin: '14px 0px',
            '& > * + *': {
                marginTop: '12px'
            },
        },
    }));

    const EmptyHeader = () => {
        const classes = useToolbarStyles();

        return <div className={classes.rootLinear} style={{ visibility: "hidden" }}>
            <LinearProgress variant="determinate" value={0} color="secondary" />
            <LinearProgress variant="determinate" value={0} color="secondary" />
        </div>
    }

    const LinearHeader = props => {
        const classes = useToolbarStyles();

        let headerWrapper = <div className={classes.rootLinear}>
            <LinearProgress color="secondary" />
            <LinearProgress color="secondary" variant="determinate" value={0} />
        </div>

        if (!props.zeroHeader) {
            const testProgress = props.type === PACKAGE.TEST_TYPE.TEST ? props.status : 100;
            const finalProgres = props.type === PACKAGE.TEST_TYPE.FINAL ? props.status : 0;

            if (props.type === PACKAGE.TEST_TYPE.TEST && props.status === 100) {
                headerWrapper = <div className={classes.rootLinear}>
                    <LinearProgress variant="determinate" value={testProgress} color="secondary" />
                    <LinearProgress color="secondary" />
                </div>
            }
            else {
                headerWrapper = <div className={classes.rootLinear}>
                    <LinearProgress variant="determinate" value={testProgress} color="secondary" />
                    <LinearProgress variant="determinate" value={finalProgres} color="secondary" />
                </div>
            }
        }

        return headerWrapper;
    }

    const enhancedToolbar = props.header ? <LinearHeader status={props.header.status} type={props.header.testType} zeroHeader={props.header.zeroHeader} /> : <EmptyHeader />;
    return enhancedToolbar;
}

export default Log;