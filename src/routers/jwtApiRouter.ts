import express from "express";
import { Router, Request, Response } from 'express';

const apiRouter = Router();

// Define your other routes here
apiRouter.get('/', (req: Request, res: Response) => {
    res.send('Hello from API!');
});

const jwtApiRouter = Router();

// Define JWT-related routes here
jwtApiRouter.get('/', (req: Request, res: Response) => {
    res.send('Hello from JWT API!');
});

apiRouter.use('/jwt', jwtApiRouter);

export default apiRouter;
