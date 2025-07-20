import { isAuthUser } from "@/lib/auth/TokenAuth";
import { NextRequest, NextResponse } from "next/server";
import { ConnectDB } from "@/lib/database/ConnectDB";
import UserData from "@/lib/database/Models/UserSchema";

export const GET = async (request) => {

    const response = await isAuthUser(request);
    if (response instanceof NextResponse) return response;

    await ConnectDB();
    const data = await UserData.findById(response.id);

    const userData = {
        id: data._id,
        name: data.name,
        mailId: data.mailId,
        joinedOn: data.createdAt,
        home: data?.home ? data.home : ''
    }

    return NextResponse.json({ 'Status': 'Success', 'Data': userData })
}
