'use client'

import { getCookie } from '@/actions/set-cookie'
import DashboardAdmin from '@/components/dashboard/admin'
import DashboardStaff from '@/components/dashboard/staff'
import Loading from '@/components/wrapper/loading'
import { useEffect, useState } from 'react'

export default function DecideIfItsAdmin() {
	const [role, setRole] = useState<boolean | undefined>(undefined)
	const checkRole = async () => {
		const is_admin = await getCookie('is')
		setRole(is_admin! == 'true')
	}
	useEffect(() => {
		checkRole()
	}, [])
	if (role == undefined) {
		return <Loading />
	}
	return role ? <DashboardAdmin /> : <DashboardStaff />
}
