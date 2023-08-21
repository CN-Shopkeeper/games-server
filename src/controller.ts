import Koa from "koa";
import path from "path";
import fs from "fs";

import logger from "./winston";
import { IRankRecord } from "./type";

class PacmanController {
  static filePath = path.join(
    __dirname,
    "..",
    "data",
    "pacman_ranking_list.txt"
  );

  async getRankingList(ctx: Koa.Context) {
    try {
      const result = fs.readFileSync(PacmanController.filePath);
      console.log(result);
      ctx.body = result;
    } catch (error) {
      logger.error(`${(error as Error).message}`);
      ctx.throw(400, "未知错误");
    }
  }

  async addRecord(ctx: Koa.Context) {
    const { id, score } = ctx.request.body;
    if (!id || !score) {
      ctx.throw(400, `请求参数不正确: id = ${id}, score = ${score}`);
    }
    const result = fs.readFileSync(PacmanController.filePath, "utf-8");
    console.log(result);

    const lines = result.split("\n");
    let rankingList: IRankRecord[] = [];
    for (let i = 0; i < Math.floor(lines.length / 2); i++) {
      const id_ = lines[i * 2].trim();
      const score_: number = Number(lines[i * 2 + 1].trim());
      rankingList.push({ id: id_, score: score_ });
    }
    rankingList.push({ id, score });
    rankingList.sort((lhs, rhs) => {
      return rhs.score - lhs.score;
    });
    rankingList = rankingList.slice(0, Math.min(20, rankingList.length));
    try {
      let str = "";
      for (let i = 0; i < rankingList.length; i++) {
        const { id: id_, score: score_ } = rankingList[i];
        str += id_ + "\n";
        str += score_ + "\n";
      }
      fs.writeFileSync(PacmanController.filePath, "");
      fs.appendFileSync(PacmanController.filePath, str);
      logger.info(
        `adding record\n${JSON.stringify(
          ctx.request.body,
          null,
          2
        )}\nsuccess!\nNow the List is ${str}`
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
