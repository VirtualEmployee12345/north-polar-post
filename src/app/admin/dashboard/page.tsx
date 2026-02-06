import prisma from '@/lib/prisma'
import AutoRefresh from './AutoRefresh'

export const dynamic = 'force-dynamic'

const LETTER_STATUSES = ['PENDING', 'QUEUED', 'SENDING', 'SENT', 'FAILED'] as const

function startOfToday(date: Date) {
  const next = new Date(date)
  next.setHours(0, 0, 0, 0)
  return next
}

function startOfWeek(date: Date) {
  const next = new Date(date)
  const day = next.getDay()
  const diff = (day + 6) % 7
  next.setDate(next.getDate() - diff)
  next.setHours(0, 0, 0, 0)
  return next
}

function formatTimestamp(value?: Date | null) {
  if (!value) return '—'
  return value.toISOString()
}

export default async function DashboardPage() {
  const now = new Date()
  const todayStart = startOfToday(now)
  const weekStart = startOfWeek(now)

  // Default values if queries fail
  let ordersToday = 0
  let ordersWeek = 0
  let ordersAll = 0
  let letterGroups: any[] = []
  let dlqCount = 0
  let circuitStates: any[] = []
  let cronRun: any = null
  let recentFailures: any[] = []
  let hasError = false
  let errorMessage = ''

  try {
    // Fetch orders
    ordersToday = await prisma.order.count({ 
      where: { createdAt: { gte: todayStart } } 
    })
    ordersWeek = await prisma.order.count({ 
      where: { createdAt: { gte: weekStart } } 
    })
    ordersAll = await prisma.order.count()
    
    // Fetch letter stats (individual counts to avoid groupBy type issues)
    const letterCounts = await Promise.all(
      LETTER_STATUSES.map(status => 
        prisma.letter.count({ where: { status: status as any } })
      )
    )
    letterGroups = LETTER_STATUSES.map((status, i) => ({
      status,
      _count: { status: letterCounts[i] }
    }))
    
    // Fetch DLQ count
    dlqCount = await prisma.failedLetter.count({ 
      where: { resolved: false } 
    })
    
    // Fetch circuit breaker states
    circuitStates = await prisma.circuitBreakerState.findMany({ 
      orderBy: { service: 'asc' } 
    })
    
    // Fetch cron run info
    cronRun = await prisma.cronRun.findUnique({ 
      where: { name: 'letterProcessor' } 
    })
    
    // Fetch recent failures
    recentFailures = await prisma.failedLetter.findMany({
      where: { resolved: false },
      orderBy: { lastAttemptAt: 'desc' },
      take: 10,
      include: {
        letter: {
          include: {
            order: true,
          },
        },
      },
    })
  } catch (e: any) {
    console.error('Dashboard error:', e)
    hasError = true
    errorMessage = e.message || 'Database error - migrations may be pending'
  }

  const statusMap = LETTER_STATUSES.reduce((acc, status) => {
    acc[status] = 0
    return acc
  }, {} as Record<(typeof LETTER_STATUSES)[number], number>)

  for (const row of letterGroups) {
    statusMap[row.status as (typeof LETTER_STATUSES)[number]] = row._count.status
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-900">
      <AutoRefresh intervalMs={30000} />
      <div className="mx-auto max-w-6xl space-y-10">
        <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">North Polar Post</p>
            <h1 className="text-3xl font-semibold tracking-tight">Operations Dashboard</h1>
          </div>
          <div className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs text-slate-500 shadow-sm">
            Updated: {now.toISOString()}
          </div>
        </header>

        {hasError && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            <p className="font-semibold">Dashboard Error</p>
            <p className="text-sm">{errorMessage}</p>
            <p className="mt-2 text-xs text-red-500">
              Check that database migrations have run: npx prisma migrate deploy
            </p>
          </div>
        )}

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs uppercase text-slate-500">Orders today</p>
            <p className="mt-2 text-3xl font-semibold">{ordersToday}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs uppercase text-slate-500">Orders this week</p>
            <p className="mt-2 text-3xl font-semibold">{ordersWeek}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs uppercase text-slate-500">Orders all time</p>
            <p className="mt-2 text-3xl font-semibold">{ordersAll}</p>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:col-span-2">
            <p className="text-xs uppercase text-slate-500">Letters by status</p>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
              {LETTER_STATUSES.map((status) => (
                <div key={status} className="rounded-xl bg-slate-100/70 px-3 py-2 text-center">
                  <p className="text-[11px] uppercase text-slate-500">{status}</p>
                  <p className="mt-1 text-xl font-semibold">{statusMap[status]}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs uppercase text-slate-500">DLQ unresolved</p>
            <p className="mt-2 text-3xl font-semibold">{dlqCount}</p>
            <p className="mt-4 text-xs uppercase text-slate-500">Cron last run</p>
            <p className="mt-1 text-sm text-slate-700">
              {formatTimestamp(cronRun?.lastRunAt)}
            </p>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:col-span-2">
            <p className="text-xs uppercase text-slate-500">Recent failed letters</p>
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="text-left text-xs uppercase text-slate-400">
                  <tr>
                    <th className="pb-2">Letter</th>
                    <th className="pb-2">Order</th>
                    <th className="pb-2">Error</th>
                    <th className="pb-2">Last Attempt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentFailures.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-4 text-slate-500">
                        No unresolved failures.
                      </td>
                    </tr>
                  ) : (
                    recentFailures.map((failure) => (
                      <tr key={failure.id} className="text-slate-700">
                        <td className="py-3">{failure.letterId.slice(-8)}</td>
                        <td className="py-3">{failure.letter?.orderId?.slice(-8) || '—'}</td>
                        <td className="py-3 max-w-xs truncate">{failure.error}</td>
                        <td className="py-3">{formatTimestamp(failure.lastAttemptAt)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-xs uppercase text-slate-500">Circuit breakers</p>
            <div className="mt-4 space-y-3">
              {circuitStates.length === 0 ? (
                <div className="rounded-xl bg-slate-100/70 px-3 py-2 text-sm text-slate-600">
                  No circuit breaker activity.
                </div>
              ) : (
                circuitStates.map((state) => (
                  <div key={state.id} className="rounded-xl border border-slate-100 px-3 py-2">
                    <p className="text-xs uppercase text-slate-500">{state.service}</p>
                    <p className={`mt-1 text-sm font-semibold ${
                      state.state === 'OPEN' ? 'text-red-600' : 
                      state.state === 'HALF_OPEN' ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {state.state}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Failures: {state.failureCount}
                    </p>
                    {state.openedAt && (
                      <p className="mt-1 text-xs text-slate-500">
                        Opened: {formatTimestamp(state.openedAt)}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}