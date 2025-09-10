'use strict';

const _ = require('lodash');

const getDataInfo = ({fields = [] , Object = {} }) => {
    return _.pick(Object, fields);
}

const getSelectData = (select) => {
    return Object.fromEntries(select.map((item) => [item, 1]));
}

const getUnSelectData = (select) => {
    return Object.fromEntries(select.map((item) => [item, 0]));
}

module.exports = {
    getDataInfo,
    getSelectData,
    getUnSelectData
}