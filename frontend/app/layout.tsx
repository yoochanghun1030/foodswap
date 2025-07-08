// app/layout.tsx

import './globals.css'
import 'leaflet/dist/leaflet.css'
import { ReactNode } from 'react'

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
        <body className="min-h-screen flex flex-col text-gray-800">
        {/* ========== HEADER ========== */}
        <header className="w-full sticky top-0 z-50 bg-white/70 backdrop-blur-md shadow-sm py-4 px-6 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-red-600 flex items-center">
                <span className="mr-2">🍽</span>Food Exchange App
            </h1>
        </header>

        {/* ========== MAIN ========== */}
        <main
            className="flex-1 flex justify-center items-center px-4 py-12 bg-fixed bg-center bg-cover"
            style={{ backgroundImage: 'url("/meal.jpg")' }}
        >
            <div className="relative max-w-3xl w-full rounded-3xl overflow-hidden shadow-2xl">
                <div
                    className="absolute inset-0 bg-[url('/plate.jpg')] bg-center bg-cover"
                />
                <div className="relative p-8 md:p-12">
                    {children}
                </div>
            </div>
        </main>

        {/* ========== FOOTER ========== */}
        <footer className="w-full text-center py-6 text-sm text-gray-500 border-t bg-white/50 backdrop-blur-sm">
            © 2025 Food Exchange App. All rights reserved.
        </footer>
        </body>
        </html>
    )
}
