/**
 * 1080 min -> 18:00 
 */

export function convertMinutestoHoursString(minutes: number){

    const hourAmount = Math.floor(minutes / 60);
    const minutesAmount = (minutes % 60)

    return `${String(hourAmount).padStart(2,'0')}:${String(minutesAmount).padStart(2,'0')}`;  
}