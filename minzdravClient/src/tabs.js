import React from 'react';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Badge from "@material-ui/core/Badge";

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <Typography
            component="div"
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
        >
            {value === index && <Box p={3}>{children}</Box>}
        </Typography>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `full-width-tab-${index}`,
        'aria-controls': `full-width-tabpanel-${index}`,
    };
}

const useStyles = makeStyles(theme => ({
    root: {
        backgroundColor: '#edeef0',
        '& .MuiTabs-flexContainer': {
            width: '50%'
        }
    },
}));

export default function TabsLight(props) {
    const classes = useStyles();
    const theme = useTheme();
    const [value, setValue] = React.useState(1);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleChangeIndex = index => {
        setValue(index);
    };

    const getLabelPassed = amount => {
        let labelPassed = <div>
            <span>Пройдено</span>
            <span></span>
        </div>;

        if (amount > 0) {
            labelPassed = <div>
                <span>Пройдено</span>
                <span style={{ marginLeft: '16px' }}><Badge color="secondary" badgeContent={<span>+{props.notifications}</span>} /></span>
            </div>;
        }

        return labelPassed;
    }

    const passLabel = <span className='tabsCaption'>Пройти</span>;
    const passedLabel = <span className='tabsCaption'>{getLabelPassed(props.notifications)}</span>;

    return (
        <div className={classes.root}>
            <div className='tabContainer'>
                <AppBar position="static" color="default">
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        indicatorColor="secondary"
                        textColor="secondary"
                        variant="fullWidth"
                        aria-label="full width tabs example">
                        <Tab label={passedLabel} onClick={props.clearNotoficationsHandler} {...a11yProps(0)} />
                        <Tab label={passLabel} {...a11yProps(1)} />
                    </Tabs>
                </AppBar>
            </div>
            <SwipeableViews
                axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                index={value}
                onChangeIndex={handleChangeIndex}>
                <TabPanel value={value} index={0} dir={theme.direction} style={{ minHeight: '460px' }}>
                    {props.completed}</TabPanel>
                <TabPanel value={value} index={1} dir={theme.direction} style={{ minHeight: '460px' }}>
                    {props.complete}</TabPanel>
            </SwipeableViews>
        </div>
    );
}