import express from "express";
import { validate } from "../lib/validation";
import { BlockCreateSchema } from "@jimmodel/shared";
import { prisma } from "../prisma";
import ConstraintViolationError from "../lib/errors/constraint-violation-error";
import NotFoundError from "../lib/errors/not-found-error";

async function create(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const blockPayload = validate(req.body, BlockCreateSchema);

    // TODO - call model instead

    const ids = await prisma.model.findMany({
      where: { id: { in: blockPayload.modelIds } },
      select: { id: true },
    });

    if (ids.length !== blockPayload.modelIds.length) {
      throw new ConstraintViolationError("Invalid model ids");
    }

    const block = await prisma.block.create({
      data: {
        start: blockPayload.start,
        end: blockPayload.end,
        reason: blockPayload.reason,
        type: blockPayload.type,
        models: { connect: blockPayload.modelIds.map((id) => ({ id })) },
      },
      include: { models: true },
    });

    res.status(201).json(block);
  } catch (err) {
    next(err);
  }
}

async function deleteById(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const blockId = req.params.id;
    const block = await prisma.block.findUnique({ where: { id: blockId } });
    if (block === null) {
      throw new NotFoundError("Block not found");
    }

    await prisma.block.delete({ where: { id: blockId } });

    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
}


const blockController = {
  create,
  deleteById
}


export default blockController
