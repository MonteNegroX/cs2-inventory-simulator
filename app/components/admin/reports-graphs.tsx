"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, TrendingUp, TrendingDown, BarChart3 } from "lucide-react"

interface ReportsGraphsProps {
  timeRange: string
}

export default function ReportsGraphs({ timeRange }: ReportsGraphsProps) {
  // Mock data for different time periods
  const periodData = {
    today: { revenue: 4250, users: 156, cases: 890, conversion: 3.2 },
    yesterday: { revenue: 3890, users: 142, cases: 823, conversion: 2.9 },
    week: { revenue: 28450, users: 1247, cases: 6780, conversion: 3.1 },
    month: { revenue: 125430, users: 5890, cases: 28900, conversion: 3.4 },
  }

  const monthlyComparison = [
    { month: "Январь 2024", revenue: 98450, users: 4560, plan: 95000, fact: 98450 },
    { month: "Февраль 2024", revenue: 112340, users: 5230, plan: 105000, fact: 112340 },
    { month: "Март 2024", revenue: 125430, users: 5890, plan: 115000, fact: 125430 },
    { month: "Апрель 2024", revenue: 0, users: 0, plan: 125000, fact: 0 },
  ]

  const kpiMetrics = [
    {
      name: "Общий доход",
      current: 125430,
      target: 120000,
      status: "success",
      change: 12.5,
    },
    {
      name: "Активные пользователи",
      current: 5890,
      target: 6000,
      status: "warning",
      change: 8.2,
    },
    {
      name: "Конверсия в покупку",
      current: 3.4,
      target: 4.0,
      status: "warning",
      change: 0.8,
    },
    {
      name: "ARPU",
      current: 89.5,
      target: 85.0,
      status: "success",
      change: 15.3,
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "text-green-600"
      case "warning":
        return "text-yellow-600"
      case "danger":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return "default"
      case "warning":
        return "secondary"
      case "danger":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <div className="space-y-6">
      {/* Quick Stats Dashboard */}
      <div>
        <h3 className="text-lg font-semibold mb-4">📅 Дашборд по периодам</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Сегодня</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-xs text-muted-foreground">Доход</span>
                  <span className="text-sm font-bold">${periodData.today.revenue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-muted-foreground">Пользователи</span>
                  <span className="text-sm font-bold">{periodData.today.users}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-muted-foreground">Кейсы</span>
                  <span className="text-sm font-bold">{periodData.today.cases}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-muted-foreground">Конверсия</span>
                  <span className="text-sm font-bold">{periodData.today.conversion}%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Вчера</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-xs text-muted-foreground">Доход</span>
                  <span className="text-sm font-bold">${periodData.yesterday.revenue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-muted-foreground">Пользователи</span>
                  <span className="text-sm font-bold">{periodData.yesterday.users}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-muted-foreground">Кейсы</span>
                  <span className="text-sm font-bold">{periodData.yesterday.cases}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-muted-foreground">Конверсия</span>
                  <span className="text-sm font-bold">{periodData.yesterday.conversion}%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Последние 7 дней</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-xs text-muted-foreground">Доход</span>
                  <span className="text-sm font-bold">${periodData.week.revenue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-muted-foreground">Пользователи</span>
                  <span className="text-sm font-bold">{periodData.week.users}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-muted-foreground">Кейсы</span>
                  <span className="text-sm font-bold">{periodData.week.cases}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-muted-foreground">Конверсия</span>
                  <span className="text-sm font-bold">{periodData.week.conversion}%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Последние 30 дней</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-xs text-muted-foreground">Доход</span>
                  <span className="text-sm font-bold">${periodData.month.revenue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-muted-foreground">Пользователи</span>
                  <span className="text-sm font-bold">{periodData.month.users}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-muted-foreground">Кейсы</span>
                  <span className="text-sm font-bold">{periodData.month.cases}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs text-muted-foreground">Конверсия</span>
                  <span className="text-sm font-bold">{periodData.month.conversion}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Monthly Comparison */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Сравнение по месяцам</h3>
        <Card>
          <CardHeader>
            <CardTitle>Динамика роста по месяцам</CardTitle>
            <CardDescription>Сравнение с предыдущими периодами</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Месяц</TableHead>
                  <TableHead>Доход</TableHead>
                  <TableHead>Пользователи</TableHead>
                  <TableHead>Рост дохода</TableHead>
                  <TableHead>Рост пользователей</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {monthlyComparison.map((month, index) => {
                  const prevMonth = index > 0 ? monthlyComparison[index - 1] : null
                  const revenueGrowth =
                    prevMonth && month.revenue > 0 ? ((month.revenue - prevMonth.revenue) / prevMonth.revenue) * 100 : 0
                  const userGrowth =
                    prevMonth && month.users > 0 ? ((month.users - prevMonth.users) / prevMonth.users) * 100 : 0

                  return (
                    <TableRow key={month.month}>
                      <TableCell className="font-medium">{month.month}</TableCell>
                      <TableCell>
                        {month.revenue > 0 ? `$${month.revenue.toLocaleString()}` : "Текущий месяц"}
                      </TableCell>
                      <TableCell>{month.users > 0 ? month.users.toLocaleString() : "—"}</TableCell>
                      <TableCell>
                        {revenueGrowth !== 0 && (
                          <div className={`flex items-center ${revenueGrowth > 0 ? "text-green-600" : "text-red-600"}`}>
                            {revenueGrowth > 0 ? (
                              <TrendingUp className="h-4 w-4 mr-1" />
                            ) : (
                              <TrendingDown className="h-4 w-4 mr-1" />
                            )}
                            {Math.abs(revenueGrowth).toFixed(1)}%
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {userGrowth !== 0 && (
                          <div className={`flex items-center ${userGrowth > 0 ? "text-green-600" : "text-red-600"}`}>
                            {userGrowth > 0 ? (
                              <TrendingUp className="h-4 w-4 mr-1" />
                            ) : (
                              <TrendingDown className="h-4 w-4 mr-1" />
                            )}
                            {Math.abs(userGrowth).toFixed(1)}%
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Plan vs Fact KPIs */}
      <div>
        <h3 className="text-lg font-semibold mb-4">🎯 План/факт по ключевым метрикам</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>KPI Dashboard</CardTitle>
              <CardDescription>Выполнение плановых показателей</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {kpiMetrics.map((metric) => (
                  <div key={metric.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{metric.name}</span>
                      <Badge variant={getStatusBadge(metric.status)}>
                        {metric.status === "success" ? "Выполнен" : "Не выполнен"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Факт:{" "}
                        {typeof metric.current === "number" && metric.current > 100
                          ? `$${metric.current.toLocaleString()}`
                          : `${metric.current}${metric.name.includes("Конверсия") ? "%" : metric.name.includes("ARPU") ? "" : ""}`}
                      </span>
                      <span className="text-muted-foreground">
                        План:{" "}
                        {typeof metric.target === "number" && metric.target > 100
                          ? `$${metric.target.toLocaleString()}`
                          : `${metric.target}${metric.name.includes("Конверсия") ? "%" : metric.name.includes("ARPU") ? "" : ""}`}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <div className={`flex items-center ${getStatusColor(metric.status)}`}>
                        {metric.change > 0 ? (
                          <TrendingUp className="h-3 w-3 mr-1" />
                        ) : (
                          <TrendingDown className="h-3 w-3 mr-1" />
                        )}
                        {metric.change > 0 ? "+" : ""}
                        {metric.change}% к предыдущему периоду
                      </div>
                      <span className="text-muted-foreground">
                        {((metric.current / metric.target) * 100).toFixed(0)}% от плана
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Экспорт отчётов</CardTitle>
              <CardDescription>Готовые отчёты для скачивания</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Download className="h-4 w-4 mr-2" />
                  Финансовый отчёт (PDF)
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Download className="h-4 w-4 mr-2" />
                  Пользовательская аналитика (Excel)
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Download className="h-4 w-4 mr-2" />
                  Статистика кейсов (CSV)
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Download className="h-4 w-4 mr-2" />
                  Маркетинговые метрики (PDF)
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Создать кастомный отчёт
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Performance Summary */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Сводка эффективности</h3>
        <Card>
          <CardHeader>
            <CardTitle>Общая оценка проекта</CardTitle>
            <CardDescription>Ключевые выводы и рекомендации</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h4 className="font-medium text-green-600">✅ Сильные стороны</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Высокий ROMI реферальной программы (2139%)</li>
                  <li>• Рост ARPU на 15.3%</li>
                  <li>• Стабильный рост пользователей</li>
                  <li>• Эффективность Google Ads канала</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-yellow-600">⚠️ Требует внимания</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Конверсия ниже плановой (3.4% vs 4.0%)</li>
                  <li>• Высокие расходы на маркетинг</li>
                  <li>• Низкий D30 retention (28.7%)</li>
                  <li>• Отклонения в дроп-таблице</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-blue-600">🎯 Рекомендации</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Оптимизировать воронку конверсии</li>
                  <li>• Увеличить инвестиции в реферальную программу</li>
                  <li>• Провести A/B тест новых бонусов</li>
                  <li>• Пересмотреть дроп-таблицу кейсов</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
