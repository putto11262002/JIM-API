import express from "express";
import {
  StaffCreateSchema,
  StaffGetQuerySchema,
  StaffLoginSchema,
  StaffRefreshTokenSchema,
  StaffUpdatePasswordSchema,
  StaffUpdateSchema,
} from "@jimmodel/shared/src/schemas/staff-scehma";
import { validate } from "../lib/validation";
import staffService from "../services/staff-service";
export interface IStaffController {
  create: express.Handler;
  login: express.Handler;
  getById: express.Handler;
  getSelf: express.Handler;
  getAll: express.Handler;
  refreshToken: express.Handler;
  logout: express.Handler;
  updateById: express.Handler;
  updatePasswordById: express.Handler;
  updateSelf: express.Handler;
  updateSelfPassword: express.Handler;
}

async function create(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const staffPayload = validate(req.body, StaffCreateSchema);
    const staff = await staffService.create(staffPayload);
    return res.status(201).json(staff);
  } catch (err) {
    next(err);
  }
}

async function login(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const loginPayload = validate(req.body, StaffLoginSchema);
    const loginResult = await staffService.login(loginPayload);
    return res.json(loginResult);
  } catch (err) {
    next(err);
  }
}

async function refreshToken(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const { token } = validate(req.body, StaffRefreshTokenSchema);
    const result = await staffService.refreshToken(token);
    return res.json(result);
  } catch (err) {
    next(err);
  }
}

async function logout(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    await staffService.logout(req.auth.id);
    res.sendStatus(204);
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
    const staffId = req.params.id;
   const staffPayload = validate(req.body, StaffUpdateSchema);
    await staffService.updateById(staffId, staffPayload);
    res.sendStatus(204);
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
    const query = validate(req.query, StaffGetQuerySchema);
    const paginatedStaff = await staffService.getAll(query);
    res.json(paginatedStaff);
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
    const staffId = req.params.id;
    const staff = await staffService.getById(staffId);
    return res.json(staff);
  } catch (err) {
    next(err);
  }
}

async function updatePasswordById(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const staffId = req.params.id;

    const payload = validate(req.body, StaffUpdatePasswordSchema);

    await staffService.updatePasswordById(staffId, payload);

    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
}

async function getSelf(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
   const staff = await staffService.getById(req.auth.id);
    return res.json(staff);
  } catch (err) {
    next(err);
  }
}

async function updateSelf(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const staffId = req.auth.id;

    const staffPayload = validate(req.body, StaffUpdateSchema);

   await staffService.updateById(staffId, staffPayload);

    return res.sendStatus(204);
  } catch (err) {
    next(err)
  }
}

async function updateSelfPassword(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const staffId = req.auth.id;

    const payload = validate(req.body, StaffUpdatePasswordSchema)

    await staffService.updatePasswordById(staffId, payload);

    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
}

const staffController: IStaffController = {
  create,
  login,
  getById,
  getAll,
  refreshToken,
  logout,
  updateById,
  updatePasswordById,
  getSelf,
  updateSelf,
  updateSelfPassword,
};

export default staffController;
