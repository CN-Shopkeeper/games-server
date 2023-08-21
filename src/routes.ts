import Koa from "koa";
import Router from "koa-router";
import { pacmanCtl } from "./controller";

const pacmanRouter = new Router({ prefix: "/games_server/pacman" });
pacmanRouter.get("/ranking_list", pacmanCtl.getRankingList);
pacmanRouter.post("/ranking_record", pacmanCtl.addRecord);
pacmanRouter.post("/ranking_list", pacmanCtl.addRecords);

export default function (app: Koa): void {
  app.use(pacmanRouter.routes()).use(pacmanRouter.allowedMethods());
}
