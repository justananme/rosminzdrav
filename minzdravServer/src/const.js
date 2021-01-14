const RES_HEADER_TYPE = {
    HEADER: 'header',
    CONTROLLER: 'controller',
}

const RES_HEADER_VALUE = {
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

const TEST_TYPE = {
    TEST: 'test',
    FINAL: 'final'
}

const DEGREE = {
    HIGHER_EDUCATION: 'higherEducation',
    PROFESSIONAL_EDUCATION: 'professionalEducation'
}

const SELECTORS = {
    USERNAME: '#username',
    PASSWORD: '#password',
    LOGIN_BUTTON: 'form .login__actions-section button',
    LKS_BUTTON: '.v-menubar.v-widget.c-main-menu.v-menubar-c-main-menu.v-has-width > span',
    MY_IOM_BUTTON: '.v-menubar-submenu.v-widget.c-main-menu.v-menubar-submenu-c-main-menu.v-has-width > span',
    MY_IOM_BUTTON_BREADCRUMBS: '.c-breadcrumbs.v-layout.v-widget > div:first-child',
    IOM_ROWS: '.v-table-table .v-table-row, .v-table-table .v-table-row-odd',
    OPEN_FOR_STUDYING_BUTTON: '.v-slot .v-slot-has-top-panel .v-button.v-widget',
    QUICK_NAV_BUTTON: '.v-slot.v-slot-c-flowlayout > div:nth-child(1) > div:nth-child(3)',
    QUICK_NAV_TEST_ROWS: '.popupContent .v-window-wrap .v-window-contents .v-expand > .v-slot:nth-child(2) > div:nth-child(1)',
    QUICK_NAV_TEST_ROWS_2: '.v-verticallayout.v-layout.v-vertical.v-widget.c-scrollbox-content.v-verticallayout-c-scrollbox-content.v-has-width > .v-slot',
    GET_NEW_VARIANT_BUTTON: '.v-slot.v-slot-c-panel-groupbox .v-slot.v-slot-c-flowlayout > div:nth-child(1) > div:nth-child(1)',
    VARIANT: '.v-slot.v-slot-c-panel-groupbox .v-scrollable.v-table-body-wrapper.v-table-body td:first-child',
    CLOSE_TEST_POPUP: '.v-window-outerheader',
    CLOSE_TEST_BUTTON: '.v-window-outerheader > .v-window-closebox',
    CLOSE_TEST_BUTTON_INSIDE: '.v-window-wrap .v-window-contents .v-slot.v-align-right.v-align-bottom > div > div:first-child > div:first-child',
    CLOSE_TEST_BUTTON_DISABLED: 'v-window-closebox-disabled'
}

const SUPPORTED_HOSTS = {
    HOST_1_VO: 'iom-vo.edu.rosminzdrav.ru',
    HOST_1_SPO: 'iom-spo.edu.rosminzdrav.ru',
}

const OTHERS = {
    VARIANT_BUTTON_ENABLED: 'v-button v-widget',
    TEST_ROW_TEXT: '.. Предварительное тестирование',
    FINAL_ROW_TEXT: '.. Итоговое тестирование',
    CERTIFICATE: '. Сертификат',
    LOGIN_PAGE: 'https://iom-spo.edu.rosminzdrav.ru'
}

const SQL_CONFIG = {
    database: "minzdrav",
    server: "localhost",
    driver: "msnodesqlv8",
    options: {
        trustedConnection: true
    }
}

const SERVER_PORT = 8999;

module.exports.SELECTORS = SELECTORS;
module.exports.OTHERS = OTHERS;
module.exports.RES_HEADER_TYPE = RES_HEADER_TYPE;
module.exports.RES_HEADER_VALUE = RES_HEADER_VALUE;
module.exports.TEST_TYPE = TEST_TYPE;
module.exports.DEGREE = DEGREE;
module.exports.SUPPORTED_HOSTS = SUPPORTED_HOSTS;
module.exports.SQL_CONFIG = SQL_CONFIG;
module.exports.SERVER_PORT = SERVER_PORT;