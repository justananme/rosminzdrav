import React, { useState } from 'react';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Badge from "@material-ui/core/Badge";
import styled from 'styled-components';

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

const useMuStyles = makeStyles(theme => ({
    container: {
        backgroundColor: '#edeef0',
        '& .MuiTabs-flexContainer': {
            width: '50%'
        },
        '@media (max-width: 580px)': {
            width: '100%',
        }
    },
}));

const Container2 = styled.div`
    margin: 0px 24px -20px 24px;

    @media screen and (max-width: 830px) {
        margin-left: 10px;
        margin-right: 10px;
        margin-bottom: -7px;
}`;

const Caption = styled.span`
@media screen and (max-width: 1282px) {
    font-size: 0.85rem;
}
@media screen and (max-width: 1026px) {
    font-size: 0.85rem;
}
@media screen and (max-width: 830px) {
    font-size: 0.72rem;
}
@media screen and (max-width: 580px) {
    font-size: 0.68rem;
}`;

export default function TabsLight(props) {
    const muStyles = useMuStyles();
    const theme = useTheme();

    const [value, setValue] = useState(1);

    function getLabelPassed(amount) {
        let labelPassed = <div>
            <span>Пройдено</span>
            <span></span>
        </div>;

        if (amount > 0) {
            labelPassed = <div>
                <span>Пройдено</span>
                <span style={{ marginLeft: '16px' }}>
                    <Badge color="secondary" badgeContent={<span>+{props.notifications}</span>} />
                </span>
            </div>;
        }

        return labelPassed;
    }

    const passCaption = <Caption>Пройти</Caption>;
    const passedCaption = <Caption>{getLabelPassed(props.notifications)}</Caption>;

    return (
        <div className={muStyles.container}>
            <Container2>
                <AppBar position="static" color="default">
                    <Tabs
                        value={value}
                        onChange={(e, value) => setValue(value)}
                        indicatorColor="secondary"
                        textColor="secondary"
                        variant="fullWidth"
                        aria-label="full width tabs example">
                        <Tab label={passedCaption} onClick={props.clearNotoficationsHandler} {...a11yProps(0)} />
                        <Tab label={passCaption} {...a11yProps(1)} />
                    </Tabs>
                </AppBar>
            </Container2>
            <SwipeableViews
                axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                index={value}
                onChangeIndex={(index) => setValue(index)}>
                <TabPanel value={value} index={0} dir={theme.direction} style={{ minHeight: '460px' }}>
                    {props.completed}
                </TabPanel>
                <TabPanel value={value} index={1} dir={theme.direction} style={{ minHeight: '460px' }}>
                    {props.complete}
                </TabPanel>
            </SwipeableViews>
        </div>
    );
}