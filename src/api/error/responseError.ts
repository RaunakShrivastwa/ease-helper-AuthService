import { Response } from "express";

class responseError {

  responseError = (res: Response, err: any) => {
    if (err.response) {
      return res.status(err.response.status).json(err.response.data);
    }

    return res.status(500).json({
      msg: "User Service Down",
      details: err.message,
    });
  };
}

export default new responseError();