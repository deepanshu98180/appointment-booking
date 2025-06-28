const { default: mongoose } = require('mongoose');
const User = require('../models/user');
const jwt = require('jsonwebtoken')
const env = require("../config/env");
const { SESSION_STATUSES } = require('../constants/sessionStatus');
const Session = require('../models/session');

exports.authenticateUserToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    try {
        const decoded = jwt.verify(token, env.USER_JWT_SECRET);
        console.log(decoded)
        const userStatus = await User.findOne({
            _id: new ObjectId(decoded._id),
        }).select('status');

        if (!userStatus || !userStatus.status) return res.sendStatus(403);

    const session = await Session.findOne({
      user: new ObjectId(decoded._id),
      jti: token,               
      status: SESSION_STATUSES.ACTIVE,
    });

    if (!session) {
      return res.sendStatus(403);
    }
        req.user = decoded;
        req.token = token;
        next();
    } catch (err) {
        console.log(err)
        return res.sendStatus(403);
    }
};

exports.authenticateAdminToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    try {
        const decoded = jwt.verify(token, env.ADMIN_JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        console.log(err)
        return res.sendStatus(403);
    }
};
