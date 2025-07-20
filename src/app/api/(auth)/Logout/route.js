import { NextResponse } from "next/server"
import { REFRESH_TOKEN, TOKEN } from "@/lib/auth/TokenAuth";

export const POST = async (request) => {
    const response = NextResponse.json({ 'Status': 'Success', 'Message': 'Logged Out Successfully' }, { status: 200 });

    response.cookies.set(TOKEN, '', {
        httpOnly: true,
        path: '/',
        expires: new Date(0),
    });
    response.cookies.set(REFRESH_TOKEN, '', {
        httpOnly: true,
        path: '/',
        expires: new Date(0),
    });

    return response;

}