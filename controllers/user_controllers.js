const jwt = require('jsonwebtoken');
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const bcrypt = require('bcrypt');
const constants = require('../config/constants')
const db = require('../models/index');
const sendEmail = require('../utils/email');
const { createAuthToken } = require('../utils/token')

// const sequelize = db.sequelize;
const User = db.user;
// const Address = db.contact_details;

exports.registerUser = async (req, res) => {
    //Register new  User by admin

    const {
        id,
        username,
        email,
        password
    } = req.body;
    try {
        // get existing user from db
        let existUser = await User.findOne({
            where: { username: username }
        })
        if (existUser) return res.status(409).send({
            success: false,
            message: 'ACCOUNT_ALREADY_EXISTS'
        });

        // create a new user in db
        let newUser = await User.create({
            user_id: id,
            username: username,
            email_address: email,
            password: password,
        });

        return res.status(200).send({
            success: true,
            message: 'ACCOUNT_CREATED_SUCCESSFULLY',
            data: newUser
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


/**
 * Login User
 * @param {*} req
 * @param {*} res
 * @returns {token} 
 */
exports.login = async (req, res) => {
    let { username, password } = req.body;
    try {
        let userLogin = await User.findOne({
            where: { username: username },
            raw: true
        })
        if (!userLogin) {
            return res.status(200).send({
                success: false,
                message: 'ACCOUNT_NOT_FOUND',
                data: {}

            })
        }
        const newPassword = await bcrypt.compare(password, userLogin.password);
        if (!newPassword) return res.status(401).send({ success: false, message: "INVALID_CREDENTIALS" });
        // var token = jwt.sign(
        //     {
        //         username: loginObject.username,
        //         email: loginObject.email_address
        //     },
        //     constants.auth.accessTokenSecret,
        //     {
        //         expiresIn: constants.auth.accessTokenExp
        //     }
        // )
        var token = createAuthToken({ username: userLogin.username, user_role: userLogin.user_role })
        return res.status(200).send({
            success: true,
            data: { userLogin, token }
        })

    }
    catch (error) {
        console.log(error)
        return res
            .status(500)
            .send({
                success: false,
                message: 'SOMETHING_WENT_WRONG',
                data: { error }
            })
    }
}

// Forget Password

exports.forgetPassword = async (req, res) => {
    const { UserEmailMobile } = req.body;
    try {
        let userObject = await User.findOne({
            where: {
                [Op.or]: [
                    {
                        email_address: {
                            [Op.eq]: UserEmailMobile
                        }
                    },
                    {
                        mobile_number: {
                            [Op.eq]: UserEmailMobile
                        }
                    }
                ]
            }
        })

        if (userObject) {
            let Otp = Math.floor(Math.random() * 900000 + 100000);
            console.log(Otp)

            if (userObject.email_address === UserEmailMobile) {
                await userObject.update({
                    user_otp: Otp,
                    where: { email_address: UserEmailMobile }
                })
                await sendEmail(UserEmailMobile, "Otp for resetting password", Otp)
                return res
                    .status(200)
                    .send({
                        success: true,
                        message: 'OTP_SENT_SUCCESSFULLY',
                        data: { Otp, UserEmailMobile },
                    });
            }
            else if (userObject.mobile_number === UserEmailMobile) {
                return res
                    .status(200)
                    .send({
                        success: true,
                        message: 'OTP_SENT_SUCCESSFULLY',
                        data: { Otp, UserEmailMobile },
                    });
            }
        }
        else {
            return res.status(200).send({
                success: false,
                message: 'ACCOUNT_NOT_FOUND',
                data: {}
            })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success: false,
            message: 'FAILED_TO_SEND OTP',
            data: { error }
        })
    }
}



exports.verifyOtp = async (req, res) => {
    const { UserEmailMobile, Otp } = req.body;
    try {
        let user = await User.findOne({
            where: {
                [Op.or]: [
                    {
                        email_address: {
                            [Op.eq]: UserEmailMobile
                        }
                    },
                    {
                        mobile_number: {
                            [Op.eq]: UserEmailMobile
                        }
                    }
                ]
            }
        });
        if (!user) return res
            .status(400)
            .send({
                success: false,
                message: 'USER_NOT_FOUND'
            })
        if (user.user_otp !== Otp) return res
            .status(400)
            .send({
                success: false,
                message: 'INCORRECT_OTP'
            })
        await user.update({
            user_otp: null, where: {
                [Op.or]: [
                    {
                        email_address: {
                            [Op.eq]: UserEmailMobile
                        },
                        mobile_number: {
                            [Op.eq]: UserEmailMobile
                        }
                    }
                ]
            }
        });

        return res.status(201).send({
            success: true,
            message: 'OTP_VERIFIED_SUCCESSFULLY',
        })

    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: 'SOMETHING_WENT_WRONG',
            data: { error }
        })
    }
}

exports.changePassword = async (req, res) => {

    let { UserEmailMobile, password } = req.body;
    try {
        let userObject = await User.findOne({
            where: {
                [Op.or]: [
                    {
                        username: {
                            [Op.eq]: UserEmailMobile
                        }
                    },
                    {
                        email_address: {
                            [Op.eq]: UserEmailMobile
                        }
                    },
                    {
                        mobile_number: {
                            [Op.eq]: UserEmailMobile
                        }
                    }
                ]
            },
            raw: true,
        });
        if (userObject) {
            const oldPassword = await bcrypt.compare(password, userObject.password);
            if (oldPassword) return res.status(409).send({
                success: false,
                message: 'USE_DIFFERENT_PASSWORD'
            })
            password = await bcrypt.hash(password, constants.genSalt);
            let updated = await User.update(
                { password: password },
                { where: { user_id: userObject.user_id } }
            );
            if (updated) {
                return res
                    .status(200)
                    .send({
                        success: true,
                        message: 'PASSWORD_UPDATED',
                        data: { updated },
                    });
            }
        } else {
            return res
                .status(200)
                .send({
                    success: false,
                    message: 'ACCOUNT_NOT_FOUND',
                    data: {}
                });
        }
    } catch (error) {
        console.log(exception);
        return res
            .status(500)
            .send({
                success: false,
                message: 'SOMETHING_WENT_WRONG',
                data: { error },
            });
    }
};

// exports.editUserProfile = async (req, res) => {
//     const { id } = req.params;
//     const userData = {
//         display_picture: req.body.profileImgage,
//         first_name: req.body.firstName,
//         last_name: req.body.lastName,
//         email_address: req.body.email,
//         mobile_number: req.body.mobile,
//     };
//     const addressData = {
//         user_address: req.body.address,
//         user_city: req.body.city,
//         user_state: req.body.state,
//         user_pincode: req.body.pincode,
//     }
//     try {
//         await sequelize.transaction(async function (transaction) {
//             const updatedUser = await User.update(userData, {
//                 where: { user_id: id },

//             }, { transaction })
//             await Address.findByPK(id).then(async function (address) {
//                 if (!address) {
//                     return await Address.create({
//                         addressData,
//                         user_id: updatedUser.user_id
//                     }, { transaction }
//                     )
//                 }
//                 else {
//                     return await Address.update({
//                         addressData,
//                         where: { user_id: updatedUser.user_id }
//                     }, { transaction }
//                     )
//                 }
//             })
//             return updatedUser;
//         })
//         return res
//             .status(200)
//             .json({
//                 success: true,
//                 message: 'UPDATED_DATA_SUCCESSFULLY'
//             })
//     } catch (error) {
//         console.log(error)
//         return res.status(500).json({
//             success: false,
//             message: 'SOMETHING_WENT_WRONG',
//             data: { error }
//         })
//     }
// }

