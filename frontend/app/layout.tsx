'use client'
import ReadOnlyChild from '@/types/readonly-child'
import useOverflow from '@/hook/useOverflow'
import '@/globals.sass'
import localFont from 'next/font/local'

const Roboto = localFont({
	src: './roboto-regular.woff2',
	weight: '400',
	display: 'swap',
})

export default function RootLayout({ children }: ReadOnlyChild) {
	const [overflow] = useOverflow()

	return (
		<html lang='en'>
			<head>
				<meta name="description" content="Электронная очередь для управления студентами и преподавателями в университете Нархоз. Быстрое и эффективное управление очередями." />
				<meta name="keywords" content="электронная очередь, управление очередями, система очередей, университет Нархоз, е-кезек, студенты, преподаватели, расписание, конференции" />
				<meta name="theme-color" content="#F13446" />

				<meta name="google-site-verification" content="GZ8vZk5XEzMrRN2Gs7CYLStyyJ0GBkWDn5qXxZF3PMI" />

				<link rel="icon" type="image/png" href="/favicon.png" />
				<title>e-kezek | Narxoz University</title>
			</head>
			<body className={Roboto.className + overflow}>{children}</body>
		</html>
	)
}
