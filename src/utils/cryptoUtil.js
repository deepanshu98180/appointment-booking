const CryptoJS = require("crypto-js");
const env = require("../config/env");

const decryptRequest = async (req, res, next) => {
    if (env.ENCRYPTION === "true") {
        try {
            if (req.body) {
                req.body = await decrypter(req.body?.reqData);
            }
           if (req.query) {
                req.query = await decrypter(req.query?.reqData);
            }
        } catch (error) {
            return res.status(400).json({ error: "Invalid encrypted data" });
        }
    }
    next();
};

// Encryption function
const encrypter = (data) => {
    if (env.ENCRYPTION === "true") {

        let ciphertext = CryptoJS.AES.encrypt(
            JSON.stringify(data),
            env.ENCRYPTION_SECRET
        ).toString();
        return ciphertext;
    } else { return data }
}

// Decryption function
const decrypter = async (data) => {
    try {
        if (data.reqData) {
            let string = data.reqData;
            let a = string.replace(/ /g, "+");

            let bytes = CryptoJS.AES.decrypt(a, env.ENCRYPTION_SECRET);
            let decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
            if (decryptedData) {
                return decryptedData;
            } 
                return false;
            
        } else if (data) {
            let string = data;
            let a = string.replace(/ /g, "+");

            let bytes = CryptoJS.AES.decrypt(a, env.ENCRYPTION_SECRET);
            let decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
            if (decryptedData) {
                return decryptedData;
            } else {
                return false;
            }
        } else {
            return false;
        }

    } catch (error) {
        return (error);
    }
}

module.exports = { encrypter, decryptRequest,decrypter };
