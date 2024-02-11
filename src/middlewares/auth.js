import jwt from "jsonwebtoken";

const auth = async (req, res, next) => {
  try {
    const token = req.cookies["token"];

    const decode = await jwt.verify(token, process.env.TOKEN_SECRET_KEY);

    if (!decode) {
      return res.status(401).json({
        success: false,
        message: "Unauthorised user",
      });
    }

    next();
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorised user" });
  }
};

export default auth;
