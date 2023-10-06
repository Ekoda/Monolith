import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function About() {
    return (
        <>
            <main className={`${inter.className}`}>
                <p>Welcome to the about page</p>
            </main>
        </>
    )
}
