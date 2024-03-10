import {
  Booking,
  BookingCreateInput,
  BookingGetQuery,
  BookingStatus,
  BookingUpdateInput,
  PaginatedData
} from "@jimmodel/shared";
import staffService from "./staff-service";
import { prisma } from "../prisma";
import { Prisma } from "@prisma/client";
import NotFoundError from "../lib/errors/not-found-error";
import modelService from "./model-service";
import ConstraintViolationError from "../lib/errors/constraint-violation-error";
import { buildPaginatedData } from "../lib/paginated-data";

interface IBookingService {
  create(booking: BookingCreateInput, bookedBy: string): Promise<Booking>;
  updateById(id: string, booking: BookingUpdateInput): Promise<Booking>;
  // deleteById(id: string): Promise<void>;
  addModel(bookingId: string, modelId: string): Promise<void>;
  removeModel(bookingId: string, modelId: string): Promise<void>;
  confirm(bookingId: string): Promise<void>;
  archive(bookingId: string): Promise<void>;
  unarchive(bookingId: string): Promise<void>;
  cancel(bookingId: string): Promise<void>;
  uncancel(bookingId: string): Promise<void>;
  getAll(query: BookingGetQuery): Promise<PaginatedData<Booking>>;
  getById(id: string): Promise<Booking>;
  getBookingBetweenDates(startDate: Date, endDate: Date): Promise<Booking[]>;
}

const bookingInclude = Prisma.validator<Prisma.BookingInclude>()({
  bookedBy: true,
  models: true,
});

/**
 * Create a new booking. If the booking status is not provided, it will default to PENDING
 * @param booking - The booking details
 * @param createdBy - The id of the staff that created the booking
 * @returns The created booking
 */
async function create(
  bookingInput: BookingCreateInput,
  bookedBy: string
): Promise<Booking> {
  const staff = await staffService.getById(bookedBy);

  const createdBooking = await prisma.booking.create({
    data: {
      ...bookingInput,
      status: bookingInput.status ?? BookingStatus.PENDING,
      bookedBy: {
        connect: staff,
      },
    },
    include: bookingInclude,
  });

  return createdBooking;
}

async function updateById(
  id: string,
  bookingInput: BookingUpdateInput
): Promise<Booking> {
  const booking = await prisma.booking.findFirst({
    where: {
      id,
    },
  });

  if (booking === null) {
    throw new NotFoundError("Booking not found");
  }

  if (booking.status === BookingStatus.ARCHIVED) {
    throw new ConstraintViolationError("Cannot update an archived booking");
  }

  if (booking.status === BookingStatus.CANCELED) {
    throw new ConstraintViolationError("Cannot update a canceled booking");
  }

  const updatedBooking = await prisma.booking.update({
    where: { id },
    data: bookingInput,
    include: bookingInclude,
  });

  return updatedBooking;
}

async function addModel(bookingId: string, modelId: string): Promise<void> {
  const booking = await prisma.booking.findFirst({
    where: {
      id: bookingId,
    },
  });
  if (booking === null) {
    throw new NotFoundError("Booking not found");
  }

  if (booking.status === BookingStatus.ARCHIVED) {
    throw new ConstraintViolationError("Cannot update an archived booking");
  }

  if (booking.status === BookingStatus.CANCELED) {
    throw new ConstraintViolationError("Cannot update a canceled booking");
  }

  // Check if the model exists
  await modelService.getById(modelId);

  await prisma.booking.update({
    where: { id: bookingId },
    data: {
      models: {
        connect: {
          id: modelId,
        },
      },
    },
  });
}

async function removeModel(bookingId: string, modelId: string): Promise<void> {
  const booking = await prisma.booking.findFirst({
    where: {
      id: bookingId,
    },
  });
  if (booking === null) {
    throw new NotFoundError("Booking not found");
  }

  if (booking.status === BookingStatus.ARCHIVED) {
    throw new ConstraintViolationError("Cannot update an archived booking");
  }

  if (booking.status === BookingStatus.CANCELED) {
    throw new ConstraintViolationError("Cannot update a canceled booking");
  }

  await prisma.booking.update({
    where: { id: bookingId },
    data: {
      models: {
        connect: {
          id: modelId,
        },
      },
    },
  });
}

async function getById(id: string): Promise<Booking> {
  const booking = await prisma.booking.findFirst({
    where: { id },
    include: bookingInclude,
  });
  if (booking === null) {
    throw new NotFoundError("Booking not found");
  }
  return booking;
}

async function confirm(bookingId: string): Promise<void> {
  const booking = await prisma.booking.findFirst({
    where: {
      id: bookingId,
    },
  });
  if (booking === null) {
    throw new NotFoundError("Booking not found");
  }

  if (booking.status === BookingStatus.ARCHIVED) {
    throw new ConstraintViolationError("Cannot confirm an archived booking");
  }

  if (booking.status === BookingStatus.CANCELED) {
    throw new ConstraintViolationError("Cannot confirm a canceled booking");
  }

  await prisma.booking.update({
    where: { id: bookingId },
    data: {
      status: BookingStatus.CONFIRMED,
    },
  });
}

async function archive(bookingId: string): Promise<void> {
  const booking = await prisma.booking.findFirst({
    where: {
      id: bookingId,
    },
  });
  if (booking === null) {
    throw new NotFoundError("Booking not found");
  }

  if (booking.status !== BookingStatus.PENDING) {
    throw new ConstraintViolationError("Cannot archive a non-pending booking");
  }

  await prisma.booking.update({
    where: { id: bookingId },
    data: {
      status: BookingStatus.ARCHIVED,
    },
  });
}

async function unarchive(bookingId: string): Promise<void> {
  const booking = await prisma.booking.findFirst({
    where: {
      id: bookingId,
    },
  });
  if (booking === null) {
    throw new NotFoundError("Booking not found");
  }

  if (booking.status !== BookingStatus.ARCHIVED) {
    throw new ConstraintViolationError(
      "Cannot unarchive a non-archived booking"
    );
  }

  await prisma.booking.update({
    where: { id: bookingId },
    data: {
      status: BookingStatus.PENDING,
    },
  });
}

async function cancel(bookingId: string): Promise<void> {
  const booking = await prisma.booking.findFirst({
    where: {
      id: bookingId,
    },
  });
  if (booking === null) {
    throw new NotFoundError("Booking not found");
  }

  if (booking.status !== BookingStatus.CONFIRMED) {
    throw new ConstraintViolationError("Cannot cancel an unconfirmed booking");
  }

  await prisma.booking.update({
    where: { id: bookingId },
    data: {
      status: BookingStatus.CANCELED,
    },
  });
}

async function uncancel(bookingId: string): Promise<void> {
  const booking = await prisma.booking.findFirst({
    where: {
      id: bookingId,
    },
  });
  if (booking === null) {
    throw new NotFoundError("Booking not found");
  }

  if (booking.status !== BookingStatus.CANCELED) {
    throw new ConstraintViolationError(
      "Cannot uncancel a non-canceled booking"
    );
  }

  await prisma.booking.update({
    where: { id: bookingId },
    data: {
      status: BookingStatus.PENDING,
    },
  });
}

async function getAll(query: BookingGetQuery): Promise<PaginatedData<Booking>> {
  const where: {
    AND: Prisma.BookingWhereInput[];
    OR: Prisma.BookingWhereInput[];
  } = {
    AND: [],
    OR: [],
  };

  if (query.q !== undefined) {
    where.OR.push({
      title: {
        contains: query.q,
      },
    });
    where.OR.push({
      client: {
        contains: query.q,
      },
    });
  }

  if (query.modelId !== undefined) {
    where.AND.push({
      models: {
        some: {
          id: query.modelId,
        },
      },
    });
  }

  if (query.status !== undefined) {
    where.AND.push({
      status: query.status,
    });
  }


  const page = query.page ?? 1;
  const pageSize = query.pageSize ?? 10;
  const sortBy = query.sortBy ?? Prisma.BookingScalarFieldEnum.updatedAt;
  const sortOrder = query.sortOrder ?? "desc";

  const [bookings, total] = await Promise.all([
    prisma.booking.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: {
        [sortBy]: sortOrder,
      },
      include: bookingInclude,
    }),
    prisma.booking.count({
      where,
    }),
  ]);

  const paginatedBooking = buildPaginatedData(bookings, page, pageSize, total);

  return paginatedBooking;
}



async function getBookingBetweenDates(from: Date, to: Date): Promise<Booking[]> {
    const bookings = await prisma.booking.findMany({
        where: {
        OR: [
            {
            shootingStartDate: {
                lte: to,
            },
            shootingEndDate: {
                gte: from,
            },
            },
            {
            fittingStartDate: {
                lte: to,
            },
            fittingEndDate: {
                gte: from,
            },
            },
            {
            finalMeetingDate: {
                lte: to,
            },
            },
        ],
        },
    });
    
    return bookings;

}

const bookingService: IBookingService = {
    create,
    updateById,
    getById,
    addModel,
    removeModel,
    confirm,
    archive,
    unarchive,
    cancel,
    uncancel,
    getAll,
    getBookingBetweenDates
}

export default bookingService;