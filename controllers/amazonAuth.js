const bhttp = require('bhttp');
const amazon = require('login-with-amazon');
const amazonToken = async (req, res) => {
    const url = "https://www.amazon.com/ap/oa";
    const params = {
        scope: 'profile',
        response_type: 'code',
        client_id: process.env.AMAZON_CLIENT_ID,
        redirect_uri: 'https://playcode.io/'
    };
    try {
        const result = await bhttp.get(url, params)
            .then((response) => {
                const body = response.params;
                if (!body) return res.status(400).json({
                    success: false,
                    message: 'error',
                    data: {}
                })
                return amazon.getAccessTokens(response.body.code, process.env.AMAZON_CLIENT_ID, process.env.AMAZON_CLIENT_SECRET, params.redirect_uri)
            })
        if (!result) return res.status(400).json({
            success: false,
            message: "Bad request",
            data: {}
        })
        return res.status(201).json({
            success: true,
            message: 'Successfully token generated',
            data: { result }
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
            data: {}
        })
    }

}

module.exports = amazonToken;