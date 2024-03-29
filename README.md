![index](https://sun9-64.userapi.com/impf/FUfb-j3PzFm2zvlQLWMLpkDSTW4Zbm9M1MRZeA/m1aoPhW7rgA.jpg?size=1119x603&quality=96&proxy=1&sign=8fa5e91fae2a4878c29f532352b07927&type=album)

Сервис предназначен для автоматического прохождения тестов НМО на сайте [edu.rosminzdrav.ru](https://edu.rosminzdrav.ru). Просто отметьте тесты для прохождения и программа сама пройдет их.

**Сервис состоит из трёх частей**:
- клиента (написан на React)
- сервера (написан на Node)
- базы данных (SQL Server)

**Запуск программы**:
Предварительно необходимо установить Node.js и SQL Server, можно Express версию. Для SQL Server предполагается Windows аутентификация.
1. Создать базу с именем minzdrav в SQL Server
2. Сделать RESTORE minzdrav.bak в базу minzdrav
3. Открыть папку minzdravServer в командной строке и выполнить команду 'npm install',  дождаться установки всех модулей
4. Далее открыть в командной строке папку minzdravServer\src и выполнить команду 'node varacq.js'. Если после выполнения команды в терминале не появилось никаких сообщений, то сервер успешно запущен. Можно свернуть окно с командной строкой
5. Открыть папку minzdravClient в командной строке и выполнить команду 'npm install', дождаться установки всех модулей
6. Далее в этой же папке выполнить команду 'npm start'
После выполнения всех пунктов, программа должна запуститься в браузере.


Различного рода настройки, включая порт, на котором запускается сервер и конфигурацию SQL Server можно найти в файлах const.js в обоих проектах.

**Значение полей в базе данных**:
- snils - СНИЛС
- password - пароль
- vip - неограниченный доступ к тестам (поле queries_left при значении vip true игнорируется)
- queries_left - количество тестов, которое доступно пользователю для прохождения
- queries_made - количество тестов, которые пользователя прошел с помощью системы
- query_last - дата последенго входа пользователя в систему

![pass tests](https://sun9-31.userapi.com/impg/UymH-cTkoZYJmd8jx-EZXNkjUHmZMHbZeDHJrg/-PHf13GX_iU.jpg?size=2560x1407&quality=95&sign=132005b34555cfa87fe6963fb096b0e8&type=album)
