import { Router, type IRouter } from "express";
import healthRouter from "./health";
import booksRouter from "./books";
import contentRouter from "./content";
import analyticsRouter from "./analytics";
import authRouter from "./auth";
import progressRouter from "./progress";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(progressRouter);
router.use(booksRouter);
router.use(contentRouter);
router.use(analyticsRouter);

export default router;
