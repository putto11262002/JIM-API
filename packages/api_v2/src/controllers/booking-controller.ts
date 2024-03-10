import express from "express"
import { validate } from "../lib/validation";
import { BookingAddModelSchema, BookingCreateSchema, BookingGetQuerySchema, BookingUpdateSchema } from "../schemas/booking-schema";
import bookingService from "../services/booking-service";
interface IBookingController {
    create: express.Handler;
    updateById: express.Handler;
    addModel: express.Handler;
    removeModel: express.Handler;
    confirm: express.Handler;
    archive: express.Handler;
    unarchive: express.Handler;
    cancel: express.Handler;
    uncancel: express.Handler;
    getAll: express.Handler;
    getById: express.Handler;
}




async function create(req: express.Request, res: express.Response, next: express.NextFunction){
    try{
        const bookingPayload = validate(req.body, BookingCreateSchema)
        const booking = await bookingService.create(bookingPayload, req.auth.id)
        res.json(booking)
    }catch(err){
        next(err)
    }
}

async function updateById(req: express.Request, res: express.Response, next: express.NextFunction){
    try{
        const bookingId = req.params.id
        const bookingPayload = validate(req.body, BookingUpdateSchema)
        await bookingService.updateById(bookingId, bookingPayload)
    }catch(err){
        next(err)
    }
}

async function addModel(req: express.Request, res: express.Response, next: express.NextFunction){
    try{
        const bookingId = req.params.id
        const {modelId} = validate(req.body, BookingAddModelSchema)
        await bookingService.addModel(bookingId, modelId)
    }catch(err){
        next(err)
    }
}

async function removeModel(req: express.Request, res: express.Response, next: express.NextFunction){
    try{
        const bookingId = req.params.id
        const modelId = req.params.modelId
        await bookingService.removeModel(bookingId, modelId)
    }catch(err){
        next(err)
    }
}


async function confirm(req: express.Request, res: express.Response, next: express.NextFunction){
    try{
        const bookingId = req.params.id
        await bookingService.confirm(bookingId)
    }catch(err){
        next(err)
    }
}


async function archive(req: express.Request, res: express.Response, next: express.NextFunction){
    try{
        const bookingId = req.params.id
        await bookingService.archive(bookingId)
    }catch(err){
        next(err)
    }
}

async function unarchive(req: express.Request, res: express.Response, next: express.NextFunction){
    try{
        const bookingId = req.params.id
        await bookingService.unarchive(bookingId)
    }catch(err){
        next(err)
    }
}

async function cancel(req: express.Request, res: express.Response, next: express.NextFunction){
    try{
        const bookingId = req.params.id
        await bookingService.cancel(bookingId)
    }catch(err){
        next(err)
    }
}

async function uncancel(req: express.Request, res: express.Response, next: express.NextFunction){
    try{
        const bookingId = req.params.id
        await bookingService.uncancel(bookingId)
    }catch(err){
        next(err)
    }
}

async function getAll(req: express.Request, res: express.Response, next: express.NextFunction){
    try{
        const query = validate(req.query, BookingGetQuerySchema)
        const bookings = await bookingService.getAll(query)
        res.json(bookings)
    }catch(err){
        next(err)
    }
}

async function getById(req: express.Request, res: express.Response, next: express.NextFunction){
    try{
        const bookingId = req.params.id
        const booking = await bookingService.getById(bookingId)
        res.json(booking)
    }catch(err){
        next(err)
    }
}


const bookingController: IBookingController = {
    create,
    updateById,
    addModel,
    removeModel,
    confirm,
    archive,
    unarchive,
    cancel,
    uncancel,
    getAll,
    getById
  
}

export default bookingController

