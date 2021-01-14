import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import Link from '@material-ui/core/Link';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import { withStyles } from '@material-ui/core/styles';

import wrenchIMG from './resources/wrench.png';

const styles = (theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(2),
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
});

const DialogTitle = withStyles(styles)((props) => {
    const { children, classes, onClose, ...other } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root} {...other}>
            <Typography variant="h6">{children}</Typography>
            {onClose ? (
                <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
});

class DialogNewbie extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        return (
            <Dialog
                className='dialogNewbie'
                open={this.props.open}
                onClose={this.props.closeNewbieHandler} aria-labelledby="simple-dialog-title"
                maxWidth="lg"
            >
                <DialogTitle id="customized-dialog-title" onClose={this.props.closeNewbieHandler}>
                    Инструкция для новых пользователей
                </DialogTitle>
                <div className='dialogNewbieContent'>
                    <div style={{ textAlign: 'center' }}><img src={wrenchIMG} alt="fix newbie problem" /></div>
                    <div>Уважаемый пользователь, если ранее вы не пробовали проходить образовательные модули самостоятельно на сайте edu.rosminzdrav.ru, необходимо выполнить следующие действия:</div>
                    <div className='dialogNewbiePoints'>
                        <div>Перейти на сайт <Link href="https://edu.rosminzdrav.ru" rel="nofollow" variant="body2" target='blank'>edu.rosminzdrav.ru</Link></div>
                        <div>-> Зайти в личный кабинет (кнопка в верхнем правом углу), ввести СНИЛС и пароль</div>
                        <div>-> В личном кабинете выбрать раздел 'Портфолио'</div>
                        <div>-> В разделе 'Портфолио' найти пункт 'Специальность' и выбрать вашу специальность</div>
                        <div>-> В личном кабинете выбрать раздел 'Мой план'</div>
                        <div>-> Нажать кнопку 'Добавить элементы'</div>
                        <div>-> Выбрать пункт 'Интерактивные образовательные модули'</div>
                        <div>-> Выбрать любой бесплатный модуль</div>
                        <div>-> На странице выбранного модуля нажать кнопку 'Включить в план'</div>
                        <div>-> Далее нажать кнопку 'Перейти к обучению'</div>
                        <div>-> В открывшемся окне нажать кнопку 'Быстрый переход'</div>
                        <div>-> Выбрать пункт предварительное тестирование</div>
                        <div>-> Нажать кнопку 'Получить новый вариант'</div>
                        <div>-> Кликнуть по полученному варианту</div>
                        <div>-> В открывшемся окне нажать кнопку 'Перейти к первому вопросу'</div>
                        <div>-> Выбрать любой вариант ответа и нажать кнопку 'Следующий вопрос'</div>
                        <div>-> В верхнем правому углу страницы кликнуть по иконке человечка и нажать кнопку 'Выйти'</div>
                    </div>
                    <div style={{ paddingTop: '12px' }}>Теперь, программа готова к использованию</div>
                </div>
            </Dialog>
        )
    }
}


export default DialogNewbie;