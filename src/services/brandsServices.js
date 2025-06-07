// @ts-check
const Brand = require("../../src/models/brands");
const { SUCCESS, ERROR } = require("../constants/message");
const { CATEGORY_STATUS } = require("../constants/category");

exports.createBrand = async (data) => {
  const brand = await Brand.create(data);
  return {
    success: true,
    message: SUCCESS.CREATED,
    brand,
  };
};

exports.getBrandById = async (id) => {
  const brand = await Brand.findById(id);
  if (!brand) {
    return {
      success: false,
      message: ERROR.NOT_FOUND,
    };
  }
  return {
    success: true,
    message: SUCCESS.FETCHED,
    brand,
  };
};

exports.updateBrand = async (id, data) => {
  const brand = await Brand.findOneAndUpdate({_id:id,status:{$ne:CATEGORY_STATUS.DELETED}}, data, {
    new: true,
  });
  if (!brand) {
    return {
      success: false,
      message: ERROR.NOT_FOUND,
    };
  }
  return {
    success: true,
    message: SUCCESS.UPDATED,
    brand,
  };
};

exports.updateBrandStatus = async (id, status) => {
  const brand = await Brand.findByIdAndUpdate(id, { status }, { new: true }).select("status");
  if (!brand) {
    return {
      success: false,
      message: ERROR.NOT_FOUND,
    };
  }
  return {
    success: true,
    message: SUCCESS.UPDATED,
    brand,
  };
};


