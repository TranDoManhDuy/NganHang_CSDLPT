import { NextFunction, Request, RequestHandler, Response } from 'express';

export const getInfoCustomer: RequestHandler = (req: Request, res: Response): void => {
    res.status(200).json({"status": "OKEEE", "body": req.body})
};