import Animation from "@/components/Animation";
import ReduxProvider from "@/components/Redux";
import '@/styles/global.css'

export const metadata = {
    title: "Sky Next - Weather",
    description: "Live Accurate Weather Details",
    keywords: 'weather, live, forecast, sky next',
    //   icons: {
    //     icon: '/favicon.ico',
    //     apple: '/apple-touch-icon.png',
    //   },
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <ReduxProvider>
                    {children}
                </ReduxProvider>
                <Animation />
            </body>
        </html>
    );
}
