import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'

const inter = Inter({ subsets: ['latin'] })

export default function About() {
    return (
        <>
            <main className={`${styles.main} ${inter.className}`}>
                <p>Welcome to the about page</p>
            </main>
        </>
    )
}
