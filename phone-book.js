'use strict';

/**
 * Сделано задание на звездочку
 * Реализован метод importFromCsv
 */
exports.isStar = true;

/**
 * Телефонная книга
 */
var phoneBook = [];

/**
 * Добавление записи в телефонную книгу
 * @param {String} phone
 * @param {String} name
 * @param {String} email
 * @returns {Boolean} – true, если если удалось добавить запись; false в противном случае
 */
exports.add = function (phone, name, email) {
    if (!(/\d{9}/.test(phone)) || (name === undefined)) {

        return false;
    }
    for (var i = 0; i < phoneBook.length; i++) {
        if ((phoneBook[i].phone === phone) && (phoneBook[i].name !== name)) {

            return false;
        }
    }
    var currentRecord = {
        phone: phone,
        name: name,
        email: email
    };
    phoneBook[phoneBook.length] = currentRecord;

    return true;
};

/**
 * Обновление записи в телефонной книге
 * @param {String} phone
 * @param {String} name
 * @param {String} email
  * @returns {Boolean} – true, если удалось обновить запись; false в противном случае
 */
exports.update = function (phone, name, email) {
    for (var i = 0; i < phoneBook.length; i++) {
        if ((phoneBook[i].phone === phone) && (name !== undefined)) {
            phoneBook[i].name = name;
            phoneBook[i].email = email;

            return true;
        }
    }

    return false;
};

/**
 * '1112223344' -> '+7 (111) 222-33-44'
 * @param {String} phone
 * @returns {String} телефон в нормализованном формате
 */
exports.normalPhone = function (phone) {

    return '+7 (' + phone.substr(0, 3) + ') ' + phone.substr(3, 3) + '-' + phone.substr(6, 2) +
    '-' + phone.substr(8, 2);
};

/**
 * Преобразование объекта - записи телфеонной книги в строку
 * @param {Object} record
 * @returns {String} запись в одну строку
 */
exports.makeRecordLine = function (record) {
    var line;
    if (record.email === undefined) {
        line = record.name + ', ' + exports.normalPhone(record.phone);
    } else {
        line = record.name + ', ' + exports.normalPhone(record.phone) +
        ', ' + record.email;
    }

    return line;
};

/**
 * Проверка на содержание подстроки
  * @param {Object} record
 * @param {String} query
 * @returns {Boolean} true, если есть вхождение query в одно из полей record
 */
exports.haveRecordCoin = function (record, query) {
    var key = Object.keys(record);
    for (var i = 0; i < key.length; i++) {
        if ((record[key[i]] !== undefined) && (record[key[i]].indexOf(query) !== -1)) {

            return true;
        }
    }

    return false;
};

/**
 * Поиск записей по запросу в телефонной книге
 * @param {String} query
 * @returns {Array} отсортированный массив записей, не имеющих пересечений с аргументом
 */
exports.find = function (query) {
    if (query === '') {

        return;
    }
    var recordFound = [];
    if (query === '*') {
        for (var i = 0; i < phoneBook.length; i++) {
            recordFound[recordFound.length] = exports.makeRecordLine(phoneBook[i]);
        }
    }
    for (var j = 0; j < phoneBook.length; j++) {
        if (exports.haveRecordCoin(phoneBook[j], query)) {
            recordFound[recordFound.length] = exports.makeRecordLine(phoneBook[j]);
        }
    }

    return recordFound.sort();
};

/**
 * Удаление записей по запросу из телефонной книги
 * @param {String} query
 * @returns {Number} количество удаленных записей
 */
exports.findAndRemove = function (query) {
    if (query === '') {

        return 0;
    }
    if (query === '*') {
        var n = phoneBook.length;
        phoneBook = [];

        return n;
    }
    var recordSave = [];
    var countDeleted = phoneBook.length;
    for (var i = 0; i < phoneBook.length; i++) {
        if (!exports.haveRecordCoin(phoneBook[i], query)) {
            recordSave[recordSave.length] = phoneBook[i];
            countDeleted--;
        }
    }
    phoneBook = recordSave;

    return countDeleted;
};

/**
 * Импорт записей из csv-формата
 * @star
 * @param {String} csv
 * @returns {Number} – количество добавленных и обновленных записей
 */
exports.importFromCsv = function (csv) {
    var records = csv.split('\n');
    var record;
    var countUpdate = 0;
    for (var i = 0; i < records.length; i++) {
        record = records[i].split(';');
        if (exports.update(record[1], record[0], record[2]) ||
        (exports.add(record[1], record[0], record[2]))) {
            countUpdate++;
        }
    }

    return countUpdate;
};