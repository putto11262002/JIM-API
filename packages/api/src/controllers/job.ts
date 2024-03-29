import express from "express";
import { validate } from "../lib/validation";
import {
  BookingCreateInputSchema,
  JobAddModelSchema,
  JobCreateSchema,
  JobGetQuerySchma,
  JobUpdateSchema,
} from "@jimmodel/shared";

import  * as pgk from "@prisma/client"
import { prisma } from "../prisma";
import { buildPaginatedData } from "../lib/paginated-data";
import NotFoundError from "../lib/errors/not-found-error";
import modelService from "../services/model-service";

const jobInclude = pgk.Prisma.validator<pgk.Prisma.JobInclude>()({
  models: {
    include: {
      images: true,
      experiences: true,
    },
  },
  bookings: true,
});
async function create(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const createdById = req.auth.id;
    const jobPayload = validate(req.body, JobCreateSchema);

    const createdJob = await prisma.job.create({
      data: { ...jobPayload, createdBy: { connect: { id: createdById } } },
      include: jobInclude,
    });

    res.status(201).json(createdJob);
  } catch (err) {
    next(err);
  }
}

async function getAll(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const query = validate(req.query, JobGetQuerySchma);

    const where: pgk.Prisma.JobWhereInput = {};

    if (query.q) {
      where.OR = [];
      where.OR.push({ title: { contains: query.q, mode: "insensitive" } });
      where.OR.push({ client: { contains: query.q , mode: "insensitive"} });
      where.OR.push({ models: { some: { firstName: { contains: query.q, mode: "insensitive" } } } });
    }

    if (query.status) {
      where.status = query.status;
    }

    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 10;

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: jobInclude,
      }),
      prisma.job.count({ where }),
    ]);

    const paginatedJob = buildPaginatedData(jobs, page, pageSize, total);

    res.json(paginatedJob);
  } catch (err) {
    next(err);
  }
}

async function getById(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const jobId = req.params.id;

    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: jobInclude,
    });

    if (job === null) {
      throw new NotFoundError("Job not found");
    }

    res.json(job);
  } catch (err) {
    next(err);
  }
}

async function updateById(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const jobId = req.params.id;
    const jobPayload = validate(req.body, JobUpdateSchema);
    const job = await prisma.job.findUnique({
      where: { id: jobId },
    });

    if (job === null) {
      throw new NotFoundError("Job not found");
    }

    await prisma.job.update({
      where: { id: jobId },
      data: jobPayload,
    });

    return res.sendStatus(204);
  } catch (err) {
    next(err);
  }
}

async function addModel(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const jobId = req.params.id;
    const { modelId } = validate(req.body, JobAddModelSchema);

    const job = await prisma.job.findUnique({
      where: { id: jobId },
    });

    if (job === null) {
      throw new NotFoundError("Job not found");
    }

    await modelService.getById(modelId);

    await prisma.job.update({
      where: { id: jobId },
      data: {
        models: {
          connect: { id: modelId },
        },
      },
    });

    return res.sendStatus(204);
  } catch (err) {
    next(err);
  }
}

async function removeModel(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const jobId = req.params.id;
    const modelId = req.params.modelId;

    const job = await prisma.job.findUnique({
      where: { id: jobId },
    });

    if (job === null) {
      throw new NotFoundError("Job not found");
    }

    await prisma.job.update({
      where: { id: jobId },
      data: {
        models: {
          disconnect: { id: modelId },
        },
      },
    });

    

    return res.sendStatus(204);
  } catch (err) {
    next(err);
  }
}

async function addBooking(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const jobId = req.params.id;
    const bookingPayload = validate(req.body, BookingCreateInputSchema);

    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: {
        models: true,
      },
    });

    if (job === null) {
      throw new NotFoundError("Job not found");
    }


    // if (!bookingPayload.modelIds || bookingPayload.modelIds.length === 0) {
    //   bookingPayload.modelIds = job.models.map((model) => model.id);
    // } else {
    //   if (
    //     bookingPayload.modelIds.every((id) =>
    //       job.models.some((model) => model.id === id)
    //     )
    //   ) {
    //     throw new NotFoundError("Model not found in the job");
    //   }
    // }

    await prisma.booking.create({
      data: {
        start: bookingPayload.start,
        end: bookingPayload.end,
        type: bookingPayload.type,
        // models: {
        //   connect: bookingPayload.modelIds.map((id) => ({ id })),
        // },
        job: { connect: { id: jobId } },
      },
    });

    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
}

async function removeBooking(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const bookingId = req.params.bookingId;

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (booking === null) {
      throw new NotFoundError("Booking not found");
    }

    await prisma.booking.delete({
      where: { id: bookingId },
    });

    return res.sendStatus(204);
  } catch (err) {
    next(err);
  }
}

const jobController = {
  create,
  getAll,
  getById,
  updateById,
  addModel,
  removeModel,
  addBooking,
  removeBooking,
};

export default jobController;
