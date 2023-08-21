import Koa from "koa";
import path from "path";
import fs from "fs";

import logger from "./winston";

class PacmanController {
  static filePath = path.join(
    __dirname,
    "..",
    "data",
    "pacman_ranking_list.txt"
  );

  async getRankingList(ctx: Koa.Context) {
    const result = fs.readFileSync(PacmanController.filePath);
    ctx.body = result;
  }

  async addRecord(ctx: Koa.Context) {
    const { id, score } = ctx.request.body;
    if (!id || !score) {
      ctx.throw(400, `请求参数不正确: id = ${id}, score = ${score}`);
    }
    try {
      fs.appendFileSync(PacmanController.filePath, id + "\n");
      fs.appendFileSync(PacmanController.filePath, score + "\n");
      logger.info(
        `adding record\n${JSON.stringify(ctx.request.body, null, 2)}\nsuccess!`
      );
      ctx.status = 200;
    } catch (error) {
      logger.error(
        `adding record\n${JSON.stringify(ctx.request.body, null, 2)}\nfailed!`
      );
      ctx.throw(400, "未知错误");
    }
  }

  async addRecords(ctx: Koa.Context) {
    const records = ctx.request.body;
    console.log(records);
    try {
      fs.writeFileSync(PacmanController.filePath, "");
      for (const record of records) {
        fs.appendFileSync(PacmanController.filePath, record.id + "\n");
        fs.appendFileSync(PacmanController.filePath, record.score + "\n");
      }
      logger.info(
        `post list\n${JSON.stringify(ctx.request.body, null, 2)}\nsuccess!`
      );
      ctx.status = 200;
    } catch (error) {
      logger.error(
        `adding record\n${JSON.stringify(ctx.request.body, null, 2)}\nfailed!`
      );
      ctx.throw(400, "未知错误");
    }
  }
}

const pacmanCtl = new PacmanController();

export { pacmanCtl };
