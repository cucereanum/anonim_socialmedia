const Joi = require("joi");

exports.reduceUserDetails = (data) => {
  const schema = {
    location: Joi.string().trim().max(200).required(),
    website: Joi.string().trim().max(200).required(),
    bio: Joi.string().trim().max(200).required(),
  };
  return Joi.validate(data, schema);
};
