import React from 'react';
import Link from '@material-ui/core/Link';
import styled from 'styled-components';

const ErrorHeader = styled.div`
    font-size: 1.25rem;
    font-weight: 400;

    @media screen and (max-width: 830px) {
        font-size: 18px;
    }
    @media screen and (max-width: 530px) {
        font-size: 14px;
    }
`;

const ErrorBody = styled.div`
    font-size: 0.94rem;
    font-weight: 300;
    & a{
        color: grey;
        text-decoration: underline;
        font-size: 0.94rem;
    };

    @media screen and (max-width: 830px) {
        font-size: 15px;
        & a {
            font-size: 15px;
        }
    }
    @media screen and (max-width: 530px) {
        font-size: 12px;
        & a {
            font-size: 12px;
        }
    }
`;

const Warning = styled.div`
    @media screen and (max-width: 830px) {
        font-size: 0.845rem;
    }
    @media screen and (max-width: 730px) {
        font-size: 0.84rem;
        margin: -3px 0px;
    }
`;



export const SERVER = 'ws://localhost:8999';

export const PACKAGE = {
    RESPONSE_TYPE: {
        CREDENTIALS_ERROR: 'credsError',
        SERVER_ERROR: 'serverError',
        OK: 'ok',
    },
    DEGREE: {
        HIGHER_EDUCATION: 'higherEducation',
        PROFESSIONAL_EDUCATION: 'professionalEducation'
    },
    RESPONSE_HEADER_TYPE: {
        HEADER: 'header',
        CONTROLLER: 'controller',
    },
    RESPONSE_HEADER_VALUE: {
        OBTAIN_PROFILE: 'obtainProfile',
        COMPLETE_TESTS: 'completeTests',
        TEST_COMPLETED: 'testCompleted',
        TESTS_COMPLETED: 'testsCompleted',
        CERTIFICATE_NOT_OBTAINED: 'certificateNotObtained',
        UNSUPPORTED_HOSTNAME: 'unsupportedHostname',
        PROGRAMS_LIMIT: 'programsLimit',
        TOKEN_REST_ERROR: 'tokenRestError',
        SERVER_ERROR: 'serverError'
    },
    TEST_TYPE: {
        TEST: 'test',
        FINAL: 'final'
    },
    ERROR_CAUSED_BY: {
        CERTIFICATE: 'certificate',
        UNSUPPORTED_HOSTNAME: 'unsupportedHostname',
        ROSMINZDRAV: 'rosminzdrav'
    }
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

export const CERTIFICATE_SNACK =
    <Warning>
        <div>Не удалось получить сертификат для некоторых программ. Они были помечены предупреждающим занаком</div>
        <div>Попробуйте скачать сертификаты вручную в личном кабинете на сайте <a href='https://edu.rosminzdrav.ru/' target='_blank'>edu.rosminzdrav.ru</a></div>
    </Warning>
export const CREDS_SNACK =
    <Warning>
        <div>Неверный логин, или пароль</div>
    </Warning>
export const DEGREE_SNACK =
    <Warning>
        <div>Логин и пароль правильные, но выполнить вход не удалось</div>
        <div>Проверьте правильность указанного образования</div>
    </Warning>
export const EMPTY_LOGIN_SNACK =
    <Warning>
        <div>Укажите логин</div>
    </Warning>
export const EMPTY_PASSWORD_SNACK =
    <Warning>
        <div>Укажите пароль</div>
    </Warning>
export const UNSET_DEGREE_SNACK =
    <Warning>
        <div>Укажите уровень образования</div>
    </Warning>
export const UNSUPPORTED_HOST_SNACK =
    <Warning>
        <div>Не удалось пройти некоторые программы, так как они размещены на доменах</div>
        <div>отличных от iom-vo.edu.rosminzdrav.ru, или iom-spo.edu.rosminzdrav.ru</div>
    </Warning>
export const TOKENREST_ERROR_SNACK_1 =
    <Warning>
        <div>Произошла внутренняя ошибка сервера</div>
        <div>Попробуйте повторить запрос</div>
    </Warning>
export const TOKENREST_ERROR_SNACK_2 =
    <Warning>
        <div>Если у вас открыты сайт rosminzdrav.ru, или данная программа в других вкладках, их необходимо закрыть</div>
        <div>Это требуется для стабильной работы программы</div>
    </Warning>
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
    <ErrorHeader>Сервер rosminzdrav временно не доступен</ErrorHeader>
    <ErrorBody style={{ paddingTop: '4px' }}>Возможно, проводятся технические работы</ErrorBody>
    <ErrorBody>Попробуйте повторить запрос позднее</ErrorBody>
</div>

export const SERVER_ERROR_INSIDE = <div>
    <ErrorHeader>Нештатная ситуация на сервере</ErrorHeader>
    <ErrorBody style={{ paddingTop: '4px' }}>
        Попробуйте повторить запрос
    </ErrorBody>
    <ErrorBody>
        Если через некоторое время проблема не разрешится, <Link href="https://www.facebook.com/austrell" variant="body2" target='blank'>свяжитесь с разработчиком</Link>
    </ErrorBody>
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