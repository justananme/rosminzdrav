import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import { withStyles } from '@material-ui/core/styles';
import styled from 'styled-components';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';

import { PAYMENT } from './const';

import paymentIMG from './resources/payment.png';

const useMuStyles = (theme) => ({
    title: {
        margin: 0,
        padding: theme.spacing(2),
        '&>h6': {
            display: 'none',
        },
        '@media (max-width: 830px)': {
            padding: '12px',
            paddingLeft: '16px',
        }
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
        '@media (max-width: 830px)': {
            top: '3px',
            padding: '8px',
            '& svg': {
                width: '0.8em',
                height: '0.8em',
            },
        },
    },
    dialog: {
        '&>.MuiDialog-container.MuiDialog-scrollPaper>div:first-child': {
            minWidth: '300px',
            maxHeight: 'calc(100% - 25px)',
        },
        '@media (max-width: 730px)': {
            '&>.MuiDialog-container.MuiDialog-scrollPaper>div:first-child': {
                margin: '10px',
            }
        }
    },
    typography: {
        margin: '5px 0 0 15px',
    },
});

const Details = styled.div`
width: 100%;
&>ul {
    padding-top: 0px;
    padding-bottom: 0px;
}
&>ul>li {
    padding-top: 0px;
}
`;

const Options = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-start;
`;

const Option = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100px;
    height: 100px;
    font-family: 'Arial', sans-serif;
    box-shadow: 0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12);
`;

const Example = styled.div`
    margin: 16px;
    margin-top: 0px;
    font-size: 0.82rem;
`;



const DialogTitle = withStyles(useMuStyles)((props) => {
    const { children, classes, onClose, ...other } = props;

    return (
        <MuiDialogTitle disableTypography className={classes.title} {...other}>
            <Typography variant="h6">{children}</Typography>
            {onClose ? (
                <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
});

class DialogBalance extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { classes } = this.props;
        const styleServicePrice = { fontSize: '2rem', fontWeight: 300 };
        const styleServiceName = { fontSize: '0.8rem' };
        const stylePriceVariation = { fontSize: '0.7rem', margin: '0px 15px' };

        const commentField = "СНИЛС " + this.props.snils;
        const pricePAYG =
            <Option>
                <div style={styleServicePrice}>{PAYMENT.PRICE_ONE}</div>
                <div style={styleServiceName}>Один тест</div>
            </Option>

        const pricePrepayed =
            <Option>
                <div style={styleServicePrice}>{PAYMENT.PRICE_UNLIMITED}</div>
                <div style={styleServiceName}>Безлимит</div>
            </Option>

        const paymentOptions =
            <Options>
                {pricePAYG}
                <div style={stylePriceVariation}>или</div>
                {pricePrepayed}
            </Options>

        return (
            <Dialog
                className={classes.dialog}
                open={this.props.open}
                onClose={this.props.closeBalanceHandler}
                aria-labelledby="simple-dialog-title">
                <DialogTitle onClose={this.props.closeBalanceHandler}>
                    Пополнить баланс
                </DialogTitle>
                <Details>
                    <div style={{ textAlign: 'center' }}><img src={paymentIMG} alt="payment option" /></div>
                    <List>
                        <li>
                            <Typography
                                className={classes.typography}
                                color="textSecondary"
                                display="block"
                                variant="caption">
                                Номер карты сбербанка
                            </Typography>
                        </li>
                        <ListItem>
                            <ListItemText primary={PAYMENT.CARD} />
                        </ListItem>
                        <Divider component="li" />
                        <li>
                            <Typography
                                className={classes.typography}
                                color="textSecondary"
                                display="block"
                                variant="caption">
                                Комментарий к переводу
                            </Typography>
                        </li>
                        <ListItem>
                            <ListItemText primary={commentField} />
                        </ListItem>
                        <Divider component="li" />
                        <li>
                            <Typography
                                className={classes.typography}
                                color="textSecondary"
                                display="block"
                                variant="caption">
                                Сумма
                            </Typography>
                        </li>
                        <ListItem>
                            <ListItemText primary={paymentOptions} />
                        </ListItem>
                    </List>
                    <Example>
                        <div>На пример</div>
                        <div style={{ marginTop: '3px' }}>370р = 10 тестов</div>
                        <div>600р = прохождение всех тестов</div>
                        <div style={{ marginTop: '8px' }}>После получения перевода, ваш баланс будет пополнен в течении часа</div>
                    </Example>
                </Details>
            </Dialog>
        )
    }
}

export default withStyles(useMuStyles)(DialogBalance)