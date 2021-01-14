import React from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

const DialogTitle = ((props) => {
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
});

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
        {/* <img src={testsPassLIMG} alt="complete tests screen" /> */ }

        const content = <div className='tutorialContentDescription'>
            <div>Сервис предназначен для автоматического прохождения тестов НМО на сайте edu.rosminzdrav.ru.</div>
            <div style={{ marginTop: '12px' }}>Для прохождения тестов:</div>
            <div>1. Войдите в личный кабинет с данными, полученными в письме от Росминздарава</div>
            <div>2. Выберите тесты для прохождения, нажмите кнопку Пройти тесты. Дождитесь, пока программа пройдет выбранные тесты</div>
            <div>3. По окончании работы программы вам будут начислены баллы (ZET) и вы сможете скачать сертификаты в личном кабинете на сайте Росминздрава edu.rosminzdrav.ru.</div>
        </div>;

        const contacts = <div className='tutorialContentContacts'>
            <div>Контакты:</div>
            <div><span><a href='https://www.facebook.com/austrell' target='_blank' >facebook.com/austrell</a></span>, <span style={{marginLeft:'2px'}}>austrell@outlook.com</span></div>
        </div>

        return (
            <Dialog
                className='dialogInstruction'
                open={this.props.open}
                onClose={this.props.closeInstructionHandler}
                aria-labelledby="simple-dialog-title"
            >
                <DialogTitle id="customized-dialog-title" onClose={this.props.closeInstructionHandler}>
                </DialogTitle>
                <div className='loginInstruction'>
                    <Paper square elevation={0}>
                        <Typography className='tutorialContentTitle'>О сервисе</Typography>
                    </Paper>
                    <div className='tutorialContent'>
                        {content}
                        {contacts}
                    </div>
                </div>
            </Dialog>

        )
    }
}

export default DialogInstruction;