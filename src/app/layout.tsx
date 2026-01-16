import { Header } from '@/components/Header/Header'
import { AuthModal } from '@/components/modal/AuthModal'
import type { Metadata } from 'next'
import { Roboto } from 'next/font/google'
import 'react-toastify/dist/ReactToastify.css'
import ReduxProvider from '../store/ReduxProvider'
import './globals.css'
import InitAuth from './providers/InitAuth'

const roboto = Roboto({
	variable: '--font-roboto',
	subsets: ['latin'],
})

export const metadata: Metadata = {
	title: 'SkyFitnessPro',
	description: 'Онлайн тренировки',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='ru'>
			<body className={`${roboto.variable}`}>
				<ReduxProvider>
					<AuthModal />
					<InitAuth />
					<Header />
					{children}
				</ReduxProvider>
			</body>
		</html>
	)
}
