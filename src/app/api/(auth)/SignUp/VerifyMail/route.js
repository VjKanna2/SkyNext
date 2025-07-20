import { ConnectDB } from "@/lib/database/ConnectDB";
import UserData from "@/lib/database/Models/UserSchema";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request) => {

    const { username, mailId } = await request.json();

    await ConnectDB();
    const isThereUser = await UserData.find({ mailId: mailId });

    if (isThereUser?.mailId === mailId) {
        return NextResponse.json({ 'Status': 'Success', 'Message': 'User Mail Already Exists' })
    }

    return NextResponse.json({ 'Status': 'Success', 'Message': 'Mail ID Verified' })

}
