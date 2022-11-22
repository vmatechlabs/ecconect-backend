const constants = {
    auth: {
        accessTokenSecret:
            '455eb77101e6d1cc87871ad87b4c735d82c16f12510c4710d6ca13ce0c77f1048a9f118a51604fd567c01603e18ff8455fc ff0c7dedafe5b4ef722bbc459c7bc',
        refreshTokenSecret:
            'dd55c9b57f4f9c20c755fc8adc619258d4c94bacafe23f66e24bce5862cccb7e721d2dc2b6ac898b3d0d3f81b20b71f6c69 f67f05b895af0f86872b37cdc4bfb',
        accessTokenExp: 860000,
        refreshTokenExp: 860000 * 30,
    },
    genSalt: 10,
}
module.exports = constants;