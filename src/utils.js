'use strict';

module.exports = {
    sleep(timeout){
        return new Promise(resolve => setTimeout(resolve, timeout));
    },
};