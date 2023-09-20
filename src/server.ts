/**
 * Lib to verify (Zod)
 */

import express from "express";
import {PrismaClient} from '@prisma/client';
import cors from 'cors';
import { convertHourStringToMinutes } from "./utils/convert-hour-string-to-minuts";
import { convertMinutestoHoursString } from "./utils/convert-minutes-to-hours-string";

const APP_PORT = process.env.SERVER_PORT || 3000;

const prisma = new PrismaClient({
    log: []
});

const app = express();
app.use(express.json());
app.use(cors()); //any frontend application can access.
// app.use(cors({
//     origin: 'http´://localhost:3333' // only this frontend applicationcan access
// }))

/**
 * Param types
 * Query: url/page?page=2&sort=title
 * Route: url/page/id
 * Body: content inside the request
 */


app.get("/games", async (request, response)=>{
    const games = await prisma.game.findMany({include: {
        _count: {
            select: {
                ads: true,
            }
        }
    }});

    return response.status(200).json(games);
});

app.post("/games/:id/ads", async(request, response)=>{

    const gameId = request.params.id;

    const newAd = request.body

    const ad = await prisma.ad.create({
        data: {
            gameId: gameId,
            ...newAd,
            weekDays: newAd.weekDays.join(','),
            hourStart: convertHourStringToMinutes(newAd.hourStart),
            hourEnd: convertHourStringToMinutes(newAd.hourEnd),
        }
    })

    return response.status(201).json(ad);
});

app.get("/games/:id/ads", async (request, response) => {
    const gameId = request.params.id;

    const ads = await prisma.ad.findMany({
        select:{
            id:true,
            name: true,
            weekDays: true,
            useVoiceChannel: true,
            yearsPlaying: true,
            hourStart: true,
            hourEnd: true
        },
        where:{
            gameId: gameId, 
        },
        orderBy: {
            createdAt: 'desc',
        }
    })

    return response.status(200).json(ads.map(ad => {
        return {
            ...ad,
            weekDays: ad.weekDays.split(','),
            hourStart: convertMinutestoHoursString(ad.hourStart),
            hourEnd: convertMinutestoHoursString(ad.hourEnd),
        }
    }));
});

app.get("/ads/:id/discord", async (request, response) => {

    const adId = request.params.id;

    const ad = await prisma.ad.findFirstOrThrow({
        select:{
            discord: true,
        },
        where: {
            id: adId,
        }
    })

    return response.status(200).json({discord: ad.discord})
});


/**
 * Start listening
 */
app.listen(APP_PORT, () => {
    console.log("Started listening to Port:", APP_PORT);
});
