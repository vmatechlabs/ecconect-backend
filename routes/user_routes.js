const express = require('express');
const router = express.Router();
const middleware = require('../middlewares/middleware')
const auth = require('../controllers/user_controllers')


// econ login api

router.post('/login', auth.login);
router.post('/register', auth.registerUser);
router.post('/forget-password', auth.forgetPassword);
router.post('/verify-otp', auth.verifyOtp);
router.put('/change-password', middleware.authLogin, auth.changePassword);


// router.put('/edit-profile/:id', middleware.authLogin, auth.editUserProfile);

module.exports = router;

// Register User
/**
 * @swagger
 *  description: register new user
 * /user/register:
 *  post:
 *      tags: [Auth]
 *      summary: Creates a new user.
 *      consumes:
 *       - application/json
 *      parameters:
 *        - in: body
 *          name: user
 *          schema:
 *            type: object
 *            properties:
 *              id:
 *                type: integer
 *              username:
 *                type: string
 *              email:
 *                type: string
 *              password:
 *                type: string
 *      responses:
 *        default:
 *          description: default response
 */

// Login User
/**
 * @swagger
 *  description: Login existing user
 * /user/login:
 *  post:
 *      tags: [Auth]
 *      summary: Login with credentials
 *      consumes:
 *       - application/json
 *      parameters:
 *        - in: body
 *          name: user
 *          schema:
 *            type: object
 *            properties:
 *              username:
 *                type: string
 *              password:
 *                type: string
 *      responses:
 *        default:
 *          description: default response
 */

// forget-password
/**
 * @swagger
 *  description: Login existing user
 * /user/forget-password:
 *  post:
 *      tags: [Auth]     
 *      summary: Forget password
 *      consumes:
 *       - application/json
 *      parameters:
 *        - in: body
 *          name: user
 *          schema:
 *            type: object
 *            properties:
 *              UserEmailMobile:
 *                type: string
 *      responses:
 *        default:
 *          description: default response
 */

/**
 * @swagger
 *  description: Verify Otp
 * /user/verify-otp:
 *  post:
 *      tags: [Auth]     
 *      summary: Forget password
 *      consumes:
 *       - application/json
 *      parameters:
 *        - in: body
 *          name: user
 *          schema:
 *            type: object
 *            properties:
 *              UserEmailMobile:
 *                type: string
 *      responses:
 *        default:
 *          description: default response
 */

/**
 * @swagger
 *  description: change password
 * /user/change-password:
 *  post:
 *      tags: [Auth]     
 *      summary: change password
 *      consumes:
 *       - application/json
 *      parameters:
 *        - in: body
 *          name: user
 *          schema:
 *            type: object
 *            properties:
 *              UserEmailMobile:
 *                type: string
 *              password:
 *                type: string
 *      responses:
 *        default:
 *          description: default response
 */

/**
 * @swagger
 *  description: edit user profile
 * /user/edit-profile/{id}:
 *  put:
 *      tags: [Auth]    
 *      summary: edit the user profile
 *      consumes:
 *       - application/json
 *      parameters:
 *        - in: path
 *          name: id
 *          schema: 
 *              type: integer
 *        - in: body
 *          name: user
 *          schema:
 *            type: object
 *            properties:
 *              profileImgage:
 *                type: string
 *              firstName:
 *                type: string
 *              lastName:
 *                 type: string
 *              email:
 *                  type: string
 *              mobile:
 *                  type: string
 *              address:
 *                  type: string
 *              city:
 *                  type: string
 *              state: 
 *                  type: string
 *              pincode:
 *                  type: string 
 *      responses:
 *        default:
 *          description: default response
 */