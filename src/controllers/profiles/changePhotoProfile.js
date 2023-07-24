import * as errorStatus from "../../middlewares/globalErrorHandler/errorStatus.js";
import * as errorMessage from "../../middlewares/globalErrorHandler/errorMessage.js";
import { User } from "../../models/user.js";

/*----------------------------------------------------*/
// CHANGE PHOTO PROFILE
/*----------------------------------------------------*/
export const changePhotoProfile = async (req, res, next) => {
  try {
    const { uuid } = req.user;

    // CHECK IF FILE IS UPLOADED
    if (!req.file) {
      throw {
        status: errorStatus.BAD_REQUEST_STATUS,
        message: errorMessage.BAD_REQUEST + "Please upload an image.",
      }();
    }

    // UPDATE PHOTO PROFILE IN PROFILE DATA
    await User?.update({ photo_profile: req?.file?.path }, { where: { uuid } });

    // SEND RESPONSE
    res.status(200).json({
      message: "Photo profile was updated successfully.",
      photoUrl: req.file?.path,
    });
  } catch (error) {
    next(error);
  }
};
