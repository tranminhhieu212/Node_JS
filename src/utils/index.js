'use strict';

const _ = require('lodash');

const getDataInfo = ({fields = [] , Object = {} }) => {
    return _.pick(Object, fields);
}

module.exports = {
    getDataInfo
}