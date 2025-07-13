// app/routes/admin.tsx
"use client"

import { useState } from "react"
import { CalendarDays, DollarSign, Users, Package, TrendingUp, Target, BarChart3 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { Button } from "~/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import "~/styles/globals.css"; // или "./globals.css", если рядом
import adminStyles from "~/styles/globals.css?url";
import type {
  LinksFunction,
  LoaderFunctionArgs,
  ShouldRevalidateFunctionArgs
} from "react-router";
import { DateRange, DateRangeProvider, useDateRange } from "~/contexts/DateRangeContext";

// Import dashboard sections
import EconomicsDashboard from "~/components/admin/economics-dashboard"
import UserAnalytics from "~/components/admin/user-analytics"
import CaseMechanics from "~/components/admin/case-mechanics"
import MarketingChannels from "~/components/admin/marketing-channels"
import ABTests from "~/components/admin/ab-tests"
import ReportsGraphs from "~/components/admin/reports-graphs"
export const links: LinksFunction = () => [
  { rel: "stylesheet", href: adminStyles }
];
export default function AdminDashboard() {
  const { range, setRange } = useDateRange();

  // Mock data for overview cards
  const overviewData = {
    totalRevenue: 125430,
    revenueChange: 12.5,
    activeUsers: 8542,
    usersChange: 8.2,
    totalCases: 15678,
    casesChange: -2.1,
    conversionRate: 3.4,
    conversionChange: 0.8,
  }

  const rangeLabels: Record<string, string> = {
    '1d': 'Сегодня',
    '7d': 'Последние 7 дней',
    '30d': 'Последние 30 дней',
    '90d': 'Последние 3 месяца',
    'all': 'За всё время',
  };

  console.log("Current range:", range);

  return (
    <DateRangeProvider>
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Админская панель</h1>
              <p className="text-muted-foreground">Аналитика и статистика проекта</p>
            </div>
            <div className="flex items-center gap-4">
              <Select value={range} onValueChange={(val) => {
                setRange(val as DateRange);
                console.log("Selected range:", val);
                setTimeout(() => {
                  console.log("Updated context range:", range);
                }, 0);
                }}
                >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Выберите диапазон">
                    {{
                      '1d': 'Сегодня',
                      '7d': 'Последние 7 дней',
                      '30d': 'Последние 30 дней',
                      '90d': 'Последние 3 месяца',
                      'all': 'За всё время',
                    }[range] || 'Выберите диапазон'}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(rangeLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline">
                <CalendarDays className="h-4 w-4 mr-2" />
                Экспорт отчёта
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Общий доход</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${overviewData.totalRevenue.toLocaleString()}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 mr-1 text-green-500" />+{overviewData.revenueChange}% к предыдущему
                периоду
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Активные пользователи</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overviewData.activeUsers.toLocaleString()}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 mr-1 text-green-500" />+{overviewData.usersChange}% к предыдущему периоду
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Открыто кейсов</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overviewData.totalCases.toLocaleString()}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 mr-1 text-red-500 rotate-180" />
                {overviewData.casesChange}% к предыдущему периоду
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Конверсия в покупку</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overviewData.conversionRate}%</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 mr-1 text-green-500" />+{overviewData.conversionChange}% к предыдущему
                периоду
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="economics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="economics" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Экономика
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Пользователи
            </TabsTrigger>
            <TabsTrigger value="cases" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Кейсы
            </TabsTrigger>
            <TabsTrigger value="marketing" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Маркетинг
            </TabsTrigger>
            <TabsTrigger value="tests" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              A/B тесты
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Отчёты
            </TabsTrigger>
          </TabsList>

          <TabsContent value="economics">
            <EconomicsDashboard />
          </TabsContent>

          <TabsContent value="users">
            <UserAnalytics />
          </TabsContent>

          <TabsContent value="cases">
            <CaseMechanics />
          </TabsContent>

          <TabsContent value="marketing">
            <MarketingChannels />
          </TabsContent>

          <TabsContent value="tests">
            <ABTests />
          </TabsContent>

          <TabsContent value="reports">
            <ReportsGraphs />
          </TabsContent>
        </Tabs>
      </div>
    </div>
    </DateRangeProvider>
  )
}
