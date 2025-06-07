const Joi = require("joi");

const validate = (schema, property = "body") => {
  return (req, res, next) => {
    const data = req[property];

    if (!data) {
      return res.status(422).json({
        success: false,
        message: `${property} is required`,
      });
    }

    const { error } = schema.validate(data, { abortEarly: false });

    if (error) {
      const message = error.details
        .map((detail) =>
          detail.message.replace(/^\"(.+)\"\s/, (_, label) => `${label} `)
        )
        .join(", ");
        
      return res.status(422).json({ success: false, message });
    }

    next();
  };
};





module.exports = validate;
