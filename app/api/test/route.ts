import { currentUser } from "@clerk/nextjs/server";
import { syncUser } from "@/lib/syncUser";

export  async function GET() {
    try {
        const user =  await currentUser();
        console.log("CLERK USER:", user)
        if(!user) {
            return Response.json({
                error: 'not logged in'
            });
        }
        const email = user.emailAddresses?.[0]?.emailAddress;

        if(!email) {
            return Response.json({ error: "No email found" });
        }

        const dbUser = await syncUser({
            clerkId: user.id,
            email: user.emailAddresses[0].emailAddress,
            name: user.firstName || ''
        });
        
        return Response.json({ dbUser });
    } catch (error) {
        console.error("ERROR:", error);
        return Response.json({ error: "Something went wrong" });
    }


}