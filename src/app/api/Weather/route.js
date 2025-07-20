import { isAuthUser } from "@/lib/auth/TokenAuth";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

const KEY = process.env.WEATHER_KEY;

export const GET = async (request) => {

    const { searchParams } = new URL(request.url)

    const location = searchParams.get('location')

    if (location !== 'Trichy') {
        const response = await isAuthUser(request);
        if (response instanceof NextResponse) return response
    }

    let url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${KEY}`

    const response = await axios.get(url);
    const result = await response.data

    if (result !== null || result !== '') {
        if(result.cod === '404') {
            return NextResponse.json({ 'Status': 'Not Found', 'Message': result.message }, { status: 200 });
        }
        return NextResponse.json({ 'Status': 'Success', 'Data': result }, { status: 200 });
    } else {
        return NextResponse.json({ 'Status': 'Fail', 'Data': result });
    }

}

export const POST = async (request) => {

    const response = await isAuthUser(request);
    if (response instanceof NextResponse) return response

    const body = await request.json();
    const { latitude, longitude } = await body

    let url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${KEY}`

    const weather = await axios.get(url)
    const result = await weather.data

    if (result !== null || result !== '') {
        if(result.cod === '404') {
            return NextResponse.json({ 'Status': 'Not Found', 'Message': result.message }, { status: 200 });
        }
        return NextResponse.json({ 'Status': 'Success', 'Data': result }, { status: 200 });
    } else {
        return NextResponse.json({ 'Status': 'Fail', 'Data': result });
    }
}