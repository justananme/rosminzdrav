import React from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import styled from 'styled-components';

const useMuStyles = (theme) => ({
    typography: {
        margin: '11px',
        '@media (max-width: 530px)': {
            margin: '5px',
        },
    },
    dialog: {
        '@media (max-width: 730px)': {
            '&>.MuiDialog-container.MuiDialog-scrollPaper>div:first-child': {
                margin: '10px',
            }
        }
    },
    dialogTitle: {
        position: 'absolute',
        right: '0',
        padding: '11px',
        zIndex: '1',
        '&>button': {
            padding: '0px',
        },
        '&>button svg': {
            width: '0.8em',
            height: '0.8em',
        },
        '@media (max-width: 530px)': {
            adding: '5px',
            paddingRight: '6px',
            '&>button': {
                padding: '0px',
            },
            '&>button svg': {
                width: '0.8em',
                height: '0.8em',
            },
        }
    }

});

const Content = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex-grow: 1;
    flex-basis: 0;
    overflow: hidden;
    width: auto;
    font-size: 12px;
    color: #2f2f2f;
    margin: 6px 6px 6px 6px;
`;

const DialogTitle = (props) => {
    const { children, onClose, ...other } = props;
    return (
        <MuiDialogTitle disableTypography {...other}>
            <Typography variant="h6">{children}</Typography>
            {onClose ? (
                <IconButton aria-label="close" onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
};

const Container = styled.div`
    display: flex;
    flex-direction: column;
    height: 400px;
    max-height: 400px;
    &>div:first-child {
        flex-grow: 0 !important;
        flex-basis: 0 !important;
    }

    @media (max-width: 830px) {
        height: 80vh;
    }
`;

const Contacts = styled.div`
    color: #666666;
    & a {
        color: #666666;
    }
`;

const Instruction = styled.div`
    &>div{
        margin-top: 3px;
    }
`;

class DialogInstruction extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeStep: 0,
            maxSteps: 4
        }

        this.handleNext = this.handleNext.bind(this);
        this.handleBack = this.handleBack.bind(this);
        this.handleStepChange = this.handleStepChange.bind(this);
    }

    handleNext() {
        this.setState(prevstate => ({ activeStep: prevstate.activeStep + 1 }));
    }
    handleBack() {
        this.setState(prevstate => ({ activeStep: prevstate.activeStep - 1 }));
    }
    handleStepChange(iStep) {
        this.setState({ activeStep: iStep });
    }

    render() {
        const { classes } = this.props;

        const content =
            <Instruction>
                <div>Сервис предназначен для автоматического прохождения тестов НМО на сайте edu.rosminzdrav.ru.</div>
                <div style={{ marginTop: '12px' }}>Для прохождения тестов:</div>
                <div>1. Войдите в личный кабинет с данными, полученными в письме от Росминздарава</div>
                <div>2. Выберите тесты для прохождения, нажмите кнопку Пройти тесты. Дождитесь, пока программа пройдет выбранные тесты</div>
                <div>3. По окончании работы программы вам будут начислены баллы (ZET) и вы сможете скачать сертификаты в личном кабинете на сайте Росминздрава edu.rosminzdrav.ru.</div>
            </Instruction>;

        const contacts =
            <Contacts>
                <div>Контакты:</div>
                <div>
                    <span>
                        <a href='https://www.facebook.com/austrell' target='_blank' >facebook.com/austrell</a>
                    </span>,
                    <span style={{ marginLeft: '2px' }}>
                        austrell@outlook.com
                    </span>
                </div>
            </Contacts>

        return (
            <Dialog
                className={classes.dialog}
                open={this.props.open}
                onClose={this.props.closeInstructionHandler}
                aria-labelledby="simple-dialog-title"
            >
                <DialogTitle className={classes.dialogTitle} onClose={this.props.closeInstructionHandler}>
                </DialogTitle>
                <Container>
                    <Paper square elevation={0}>
                        <Typography className={classes.typography}>О сервисе</Typography>
                    </Paper>
                    <Content>
                        {content}
                        {contacts}
                    </Content>
                </Container>
            </Dialog>
        )
    }
}

export default withStyles(useMuStyles)(DialogInstruction)