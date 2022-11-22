const moment = require("moment");
const Sequelize = require("sequelize");
const db = require('../models/index');

const Op = Sequelize.Op;
const Message = db.status_message;


exports.createMessage = async (req, res) => {
    const payload = {
        message_id: req.body.id,
        message_description: req.body.message,
        message_date: req.body.date,
        message_time: req.body.time,
        source: req.body.source,
        destination: req.body.destination,
        integration_status: req.body.status,
    }
    try {
        let existMessage = await Message.findOne({
            where: { message_id: payload.message_id }
        });
        if (existMessage) return res
            .status(409)
            .send({
                success: false,
                message: 'MESSAGE_ID_ALREADY_EXISTS'
            });
        let newMessage = await Message.create(payload);

        return res
            .status(200)
            .send({
                success: true,
                message: 'MESSAGE_CREATED_SUCCESSFULLY',
                data: newMessage
            })
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success: false,
            message: 'SOMETHING_WENT_WRONG',
            data: {}
        })
    }
}
exports.getMessagesList = async (req, res) => {
    const { page, limit } = req.query;
    const LIMIT = limit ? limit : 10;
    const INDEX = page ? Number(page) - 1 * LIMIT : 0;
    try {
        const { rows, count } = await Message.findAndCountAll({
            limit: LIMIT,
            offset: INDEX
        })
        if (count === 0) return res.status(404).json({
            success: false,
            message: 'no messages available',
            data: {},
        })
        return res.json({
            success: true,
            data: {
                total_count: count,
                current_page: page,
                total_pages: Math.ceil(count / LIMIT),
                records: rows,
            }
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success: false,
            message: 'SOMETHING_WENT_WRONG',
            data: { error }
        })
    }
}

exports.getMessagesBySearch = async (req, res) => {
    let searchData = req.body?.search;
    const { page, limit } = req.query;
    const LIMIT = limit ? limit : 10;
    const INDEX = page ? Number(page) - 1 * LIMIT : 0;
    let options = { where: {} };
    try {
        if (searchData.id)
            options.where.message_id = searchData.id;
        if (searchData.fromDate && searchData.toDate)
            options.where.message_date = {
                [Op.between]: [moment(searchData.fromDate).set({ hour: 0, minute: 0, second: 0, millisecond: 0 }), moment(searchData.toDate).set({ hour: 23, minute: 59, second: 59 })]
            }

        if (searchData.fromTime && searchData.toTime)
            options.where.message_time = { [Op.between]: [searchData.fromtime, searchData.toTime] }
        if (searchData.source)
            options.where.source = searchData.source
        if (searchData.destination)
            options.where.destination = searchData.destination
        if (searchData.status)
            options.where.integration_status = searchData.status

        const getMessages = await Message.findAll({ options, limit: LIMIT, offset: INDEX });
        if (!getMessages) return res.status(404).send({
            success: false,
            message: 'NOT_FOUND'
        })

        return res
            .status(200)
            .send({
                success: true,
                data: getMessages
            })
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success: false,
            message: 'SOMETHING_WENT_WRONG',
            data: { error }
        })
    }

}

exports.getGraphDataByErp = async (req, res) => {
    let { erp } = req.query;
    try {
        var limit = 10;
        if (req.body.limit) {
            limit = req.body.limit;
        }
        var offset = 0;
        if (req.body.offset) {
            offset = req.body.offset;
        }
        const filterData = await Message.findAll({
            where: {
                source: {
                    [Op.like]: `%${erp}%`
                }
            },
            limit: limit,
            offset: offset,
            raw: true
        })
        if (!filterData) return res.status(404).send({
            success: false,
            message: 'NOT_FOUND'
        })
        return res
            .status(200)
            .send({
                success: true,
                data: filterData
            })
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success: false,
            message: 'SOMETHING_WENT_WRONG',
            data: { error }
        })
    }

}