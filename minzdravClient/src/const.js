import React from 'react';
import Link from '@material-ui/core/Link';

export const SERVER = 'ws://localhost:8999';

export const RES_TYPE = {
    CREDS_ERROR: 'credsError',
    SERVER_ERROR: 'serverError',
    OK: 'ok'
}

export const DEGREE = {
    HIGHER_EDUCATION: 'higherEducation',
    PROFESSIONAL_EDUCATION: 'professionalEducation'
}

export const RES_HEADER_TYPE = {
    HEADER: 'header',
    CONTROLLER: 'controller',
}

export const RES_HEADER_VALUE = {
    OBTAIN_PROFILE: 'obtainProfile',
    COMPLETE_TESTS: 'completeTests',
    TEST_COMPLETED: 'testCompleted',
    TESTS_COMPLETED: 'testsCompleted',
    CERTIFICATE_NOT_OBTAINED: 'certificateNotObtained',
    UNSUPPORTED_HOSTNAME: 'unsupportedHostname',
    PROGRAMS_LIMIT: 'programsLimit',
    TOKEN_REST_ERROR: 'tokenRestError',
    SERVER_ERROR: 'serverError'
}

export const TEST_TYPE = {
    TEST: 'test',
    FINAL: 'final'
}

export const ERROR_CAUSES = {
    CERTIFICATE: 'certificate',
    UNSUPPORTED_HOSTNAME: 'unsupportedHostname',
    ROSMINZDRAV: 'rosminzdrav'
}



export const CERTIFICATE_ERROR_TIP = <div>
    <div>Ошибка при получении сертификата</div>
    <div>Попробуйте скачать сертификат вручную в личном кабинете</div>
    <div>на сайте edu.rosminzdrav.ru</div>
</div>
export const UNSUPPORTED_HOST_ERROR_TIP = <div>
    <div>Данная программа не доступна для прохождения, так как размещена на домене, отличном от</div>
    <div>iom-vo.edu.rosminzdrav.ru или iom-spo.edu.rosminzdrav.ru</div>
</div>
export const CROWN_TIP = 'Доступ без ограничений';
export const PROFILE_TIP = <div style={{ minWidth: '250px', textAlign: 'left' }}>
    <div>Баллы - баллы (ZET) за пройденные программы в системе Росминздрава</div>
    <div style={{ marginTop: '4px' }}>Баланс - количество программ, доступных для прохождения</div>
</div>
export const PROFILE_TIP_PREMIUM = <div style={{ minWidth: '250px', textAlign: 'left' }}>Баллы (ZET) за пройденные программы в системе Росминздрава</div>



export const CERTIFICATE_SNACK = <div className='snackContentWrapper'>
    <div>Не удалось получить сертификат для некоторых программ. Они были помечены предупреждающим занаком</div>
    <div>Попробуйте скачать сертификаты вручную в личном кабинете на сайте <a href='https://edu.rosminzdrav.ru/' target='_blank'>edu.rosminzdrav.ru</a></div>
</div>
export const CREDS_SNACK = <div className='snackContentWrapper'>
    <div>Неверный логин или пароль</div>
</div>
export const DEGREE_SNACK = <div className='snackContentWrapper'>
    <div>Логин и пароль правильные, но выполнить вход не удалось</div>
    <div>Проверьте правильность указанного образования</div>
</div>
export const EMPTY_LOGIN_SNACK = <div className='snackContentWrapper'>
    <div>Укажите логин</div>
</div>
export const EMPTY_PASSWORD_SNACK = <div className='snackContentWrapper'>
    <div>Укажите пароль</div>
</div>
export const UNSET_DEGREE_SNACK = <div className='snackContentWrapper'>
    <div>Укажите уровень образования</div>
</div>
export const UNSUPPORTED_HOST_SNACK = <div className='snackContentWrapper'>
    <div>Не удалось пройти некоторые программы, так как они размещены на доменах</div>
    <div>отличных от iom-vo.edu.rosminzdrav.ru, или iom-spo.edu.rosminzdrav.ru</div>
</div>
export const TOKENREST_ERROR_SNACK_1 = <div className='snackContentWrapper'>
    <div>Произошла внутренняя ошибка сервера</div>
    <div>Попробуйте повторить запрос</div>
</div>
export const TOKENREST_ERROR_SNACK_2 = <div className='snackContentWrapper'>
    <div>Если у вас открыты сайт rosminzdrav.ru, или данная программа в других вкладках, их необходимо закрыть</div>
    <div>Это требуется для стабильной работы программы</div>
</div>
export const PROGRAMS_LIMIT_SNACK_1 = {
    message: 'Недостаточный баланс',
    balance: 'Ваш баланс: ',
    test: 'Выбрано тестов: '
}
export const PROGRAMS_LIMIT_SNACK_2 = {
    message: 'Недостаточный баланс'
}



export const PRELOADER_STEP_1 = 'Соединение с сервером';
export const PRELOADER_STEP_2 = 'Загрузка тестов';
export const PRELOADER_STEP_3 = 'Загрузка ресурсов';



export const SERVER_ERROR_TYPE = {
    OUTSIDE: 'otside',
    INSIDE: 'inside'
}


export const SERVER_ERROR_OUTSIDE = <div>
    <div className='errorHeader'>Сервер rosminzdrav временно не доступен</div>
    <div className='errorBody' style={{ paddingTop: '4px' }}>Возможно, проводятся технические работы</div>
    <div className='errorBody'>Попробуйте повторить запрос позднее</div>
</div>

export const SERVER_ERROR_INSIDE = <div>
    <div className='errorHeader'>Нештатная ситуация на сервере</div>
    <div className='errorBody' style={{ paddingTop: '4px' }}>Попробуйте повторить запрос</div>
    <div className='errorBody'>Если через некоторое время проблема не разрешится, <Link href="https://www.facebook.com/austrell" variant="body2" target='blank'>свяжитесь с разработчиком</Link></div>
</div>

export const LOGIN_INPUT = {
    LOGIN: 'login',
    PASSWORD: 'password',
    NONE: 'none'
}

export const PAYMENT = {
    CARD: '0000000000000000',
    PRICE_ONE: '37р',
    PRICE_UNLIMITED: '600р',
}