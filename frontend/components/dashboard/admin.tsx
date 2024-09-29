import { getCookie, getLanguage } from '@/actions/set-cookie'
import locales from '@/locales/common.json'
import { AdminDashboard } from '@/types/adminDashboard'
import { Language } from '@/types/lang'
import urlCreator from '@/utils/url-creator'
import { ArrowUpRight, ChevronRight, Trash2, User } from 'lucide-react'
import Link from 'next/link'
import { useCallback, useEffect, useId, useState } from 'react'
import DashboardCard from '../dashboard-card'
import DashboardHeader from '../header/dashboard'
import Heading from '../text/heading'
import Alert from '../wrapper/Alert'
import Loading from '../wrapper/loading'

const DashboardAdmin = () => {
	const typeId = useId()
	const [isHidden, setIsHidden] = useState(true)
	const [lang, setLanguage] = useState<Language>('ru')
	const [loading, setLoading] = useState<boolean>(true)
	const [loading2, setLoading2] = useState<boolean>(false)
	const [data, setData] = useState<AdminDashboard | undefined>(undefined)
	const [CName, setCName] = useState<string>('')
	const [alert, setAlert] = useState({ type: '', message: '', visible: false })

	const hideAlert = () => {
		setAlert(prevState => ({ ...prevState, visible: false }))
	}

	const toggleModal = useCallback(() => {
		setIsHidden(prevState => !prevState)
	}, [])

	const getLang = async () => {
		const language = await getLanguage()
		setLanguage(language)
	}

	const fetchData = async () => {
		try {
			const token = await getCookie('token')
			const response = await fetch(urlCreator(`interface/admin`), {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ token }),
			})

			if (response.ok) {
				const data: AdminDashboard = await response.json()
				setData(data)
				console.log(data)
			} else {
				console.error('Failed to fetch data', response.status)
			}
		} catch (e) {
			console.log('Error fetching data:', e)
		} finally {
			setLoading(false)
		}
	}

	const handleDeleteCategory = async (id: number) => {
		try {
			const response = await fetch(urlCreator(`category/${id}`), {
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
				},
			})
			if (response.ok) {
				fetchData()
			} else {
				console.error('Failed to delete category', response.status)
			}
		} catch (e) {
			console.error('Error deleting category:', e)
		}
	}

	const handleAddCategory = async (e: React.FormEvent) => {
		e.preventDefault()
		try {
			const response = await fetch(urlCreator('category/'), {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ name: CName }),
			})
			if (response.ok) {
				const data = await response.json()
				console.log('Category added:', data)
				fetchData()
				setCName('')
				toggleModal()
			} else {
				console.error('Failed to add category', response.status)
			}
		} catch (e) {
			console.error('Error adding category:', e)
		}
	}

	const handleKeyPress = useCallback(
		({ key }: { key: string }) => {
			if (key === 'Escape' && !isHidden) {
				toggleModal()
			}
		},
		[isHidden, toggleModal]
	)

	useEffect(() => {
		getLang()
		fetchData()
	}, [])

	useEffect(() => {
		window.addEventListener('keydown', handleKeyPress)
		return () => {
			window.removeEventListener('keydown', handleKeyPress)
		}
	}, [handleKeyPress])

	if (loading) {
		return <Loading />
	}

	return (
		<>
			<title>NARXOZ QUEUE | DASHBOARD</title>
			<meta name='description' content='Dashboard for narxoz queue admin.' />
			<DashboardHeader setIsLoading={setLoading2} />
			{loading2 && <Loading />}
			{alert.visible && (
				<Alert type={alert.type} message={alert.message} onClose={hideAlert} />
			)}

			<div className='min-h-screen pt-32 bg-[#F2F2F2]'>
				<div className='w-full max-w-[1280px] mx-auto flex flex-col pt-10'>
					<Heading text={`${locales[lang].adminDashboard.MainText} | Narxoz`} />
					<Heading
						text={locales[lang].adminDashboard.GeneralData}
						additionalStyle='mt-5'
					/>
					<div className='flex gap-5 mt-7'>
						<DashboardCard
							bg='#D02CE3'
							data={{
								count: data?.general_data.clients_in_queue!,
								title: locales[lang].adminDashboard.QueueClients,
							}}
							image='/dashboard/Information-circle.svg'
							additionalStyle='py-4 grow max-w-96'
						/>
						<DashboardCard
							bg='#008742'
							data={{
								count: data?.general_data.accepted_today!,
								title: locales[lang].adminDashboard.AcceptedToday,
							}}
							image='/dashboard/Group-person.svg'
							additionalStyle='py-4 grow max-w-96'
						/>
						<DashboardCard
							bg='#0D8EFF'
							data={{
								count: data?.general_data.served_today!,
								title: locales[lang].adminDashboard.ServedToday,
							}}
							image='/dashboard/Two-Person.svg'
							additionalStyle='py-4 grow max-w-96'
						/>
					</div>

					<Heading
						text={locales[lang].adminDashboard.RemoteMaintenance}
						additionalStyle='mt-10'
					/>
					<div className='flex gap-5 mt-5 mb-10'>
						<button
							className='bg-black text-white rounded-md py-3 px-3 grow hover:bg-[#111827] duration-700 flex justify-center gap-1 max-w-96'
							onClick={toggleModal}
						>
							<span>{locales[lang].adminDashboard.AddCategoryButton}</span>
							<ArrowUpRight size={18} />
						</button>
						<Link
							href={'/dashboard/add-user'}
							className='bg-black text-white rounded-md py-3 px-3 grow hover:bg-[#111827] duration-700 flex justify-center gap-1 max-w-96'
						>
							<span>{locales[lang].adminDashboard.AddUserButton}</span>
							<ArrowUpRight size={18} />
						</Link>
						<Link
							href={'/dashboard/work-time'}
							className='bg-black text-white rounded-md py-3 px-3 grow hover:bg-[#111827] duration-700 flex justify-center gap-1 max-w-96'
						>
							<span>{locales[lang].adminDashboard['work-time']}</span>
							<ArrowUpRight size={18} />
						</Link>
						<Link
							href={'/dashboard/statistics'}
							className='bg-black text-white rounded-md py-3 px-3 grow hover:bg-[#111827] duration-700 flex justify-center gap-1 max-w-96'
						>
							<span>{locales[lang].adminDashboard.Stat}</span>
							<ArrowUpRight size={18} />
						</Link>
					</div>
					{data?.categories &&
						data?.categories.map(category => (
							<div
								key={category.id}
								className='flex flex-col bg-white px-5 gap-3 py-2'
							>
								<div className='flex justify-between'>
									<Heading
										text={
											category.id == 0
												? locales[lang].adminDashboard['invalied users']
												: category.name
										}
									/>

									{category.id > 0 ? (
										<button onClick={() => handleDeleteCategory(category.id)}>
											<Trash2 />
										</button>
									) : null}
								</div>

								{category.users.length > 0 ? (
									category.users.map(user => (
										<Link
											key={user.id}
											className='bg-main rounded flex p-4 text-white'
											href={`/users/${user.id}`}
										>
											<div className='flex gap-5'>
												<User />
												<span>{`${user.last_name} ${user.first_name}`}</span>
											</div>
											<button className='ml-auto'>
												<ChevronRight />
											</button>
										</Link>
									))
								) : (
									<span className='text-center'>
										{locales[lang].adminDashboard['users-not-found']}
									</span>
								)}
							</div>
						))}
				</div>
			</div>

			{!isHidden && (
				<div className='fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center min-h-screen bg-blur'>
					<div className='flex flex-col w-[1200px] bg-white p-5 rounded-lg'>
						<Heading
							text={locales[lang].adminDashboard.AddCategoryButton}
							additionalStyle='mx-10'
						/>
						<label htmlFor={typeId} className='mx-10'>
							{locales[lang].adminDashboard.ModalNameCategory}:
						</label>
						<form
							className='flex flex-col mx-auto w-full max-w-[400px] mt-10'
							onSubmit={handleAddCategory}
						>
							<input
								type='text'
								className='input input-bordered w-full'
								id={typeId}
								onChange={e => setCName(e.target.value)}
								value={CName}
								required
								placeholder={locales[lang].adminDashboard['new-category-input']}
							/>
							<div className='flex gap-5 mt-5'>
								<button
									type='button'
									className='bg-main w-1/2 py-2 rounded-md text-white'
									onClick={toggleModal}
									title='Cancel the creating'
								>
									<span className='border-white border-[1.6px] text-white p-1 rounded mr-2 text-sm'>
										Esc
									</span>
									{locales[lang].adminDashboard.CancelButton}
								</button>
								<button
									type='submit'
									className='bg-black w-1/2 py-2 rounded-md text-white'
								>
									{locales[lang].adminDashboard.AddButton}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</>
	)
}

export default DashboardAdmin
