"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Target, Users, DollarSign, TrendingUp } from "lucide-react"

interface MarketingChannelsProps {
  timeRange: string
}

export default function MarketingChannels({ timeRange }: MarketingChannelsProps) {
  // Mock data
  const trafficSources = [
    {
      source: "Google Ads",
      users: 3456,
      ltv: 89.5,
      cac: 12.3,
      romi: 627.6,
      payingUsers: 867,
      conversionRate: 25.1,
    },
    {
      source: "Facebook",
      users: 2890,
      ltv: 67.2,
      cac: 15.8,
      romi: 325.3,
      payingUsers: 578,
      conversionRate: 20.0,
    },
    {
      source: "Telegram",
      users: 4123,
      ltv: 45.3,
      cac: 8.9,
      romi: 409.0,
      payingUsers: 824,
      conversionRate: 20.0,
    },
    {
      source: "Рефералы",
      users: 1567,
      ltv: 125.4,
      cac: 5.6,
      romi: 2139.3,
      payingUsers: 470,
      conversionRate: 30.0,
    },
    {
      source: "Органика",
      users: 2234,
      ltv: 78.9,
      cac: 0.0,
      romi: 0,
      payingUsers: 447,
      conversionRate: 20.0,
    },
  ]

  const topPartners = [
    { name: "CryptoInfluencer", referrals: 456, earned: 2340, projectEarned: 12450 },
    { name: "GameStreamer", referrals: 389, earned: 1890, projectEarned: 9870 },
    { name: "TelegramChannel", referrals: 234, earned: 1230, projectEarned: 6780 },
    { name: "YouTuber", referrals: 167, earned: 890, projectEarned: 4560 },
  ]

  const totalStats = {
    totalUsers: trafficSources.reduce((sum, source) => sum + source.users, 0),
    totalSpent: trafficSources.reduce((sum, source) => sum + source.cac * source.users, 0),
    totalRevenue: trafficSources.reduce((sum, source) => sum + source.ltv * source.payingUsers, 0),
    avgROMI: trafficSources.reduce((sum, source) => sum + source.romi, 0) / trafficSources.length,
  }

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div>
        <h3 className="text-lg font-semibold mb-4">📍 Обзор источников трафика</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Всего пользователей</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStats.totalUsers.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Из всех источников</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Потрачено на рекламу</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalStats.totalSpent.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Общие расходы</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Доход с трафика</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalStats.totalRevenue.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Общая выручка</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Средний ROMI</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStats.avgROMI.toFixed(0)}%</div>
              <div className="text-xs text-muted-foreground">Возврат инвестиций</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Traffic Sources Analysis */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Детальный анализ источников</h3>
        <Card>
          <CardHeader>
            <CardTitle>Эффективность каналов привлечения</CardTitle>
            <CardDescription>LTV, CAC и ROMI по источникам трафика</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Источник</TableHead>
                  <TableHead>Пользователи</TableHead>
                  <TableHead>Платящие</TableHead>
                  <TableHead>Конверсия</TableHead>
                  <TableHead>LTV</TableHead>
                  <TableHead>CAC</TableHead>
                  <TableHead>ROMI</TableHead>
                  <TableHead>Статус</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trafficSources.map((source) => (
                  <TableRow key={source.source}>
                    <TableCell className="font-medium">{source.source}</TableCell>
                    <TableCell>{source.users.toLocaleString()}</TableCell>
                    <TableCell>{source.payingUsers.toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <span className="mr-2">{source.conversionRate}%</span>
                        <Progress value={source.conversionRate} className="w-16 h-2" />
                      </div>
                    </TableCell>
                    <TableCell>${source.ltv}</TableCell>
                    <TableCell>${source.cac}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {source.romi > 300 ? (
                          <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                        ) : (
                          <TrendingUp className="h-4 w-4 text-yellow-500 mr-1" />
                        )}
                        {source.romi.toFixed(0)}%
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={source.romi > 300 ? "default" : "secondary"}>
                        {source.romi > 300 ? "Отличный" : "Хороший"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Referral System */}
      <div>
        <h3 className="text-lg font-semibold mb-4">🎁 Реферальная система</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>ТОП партнёры по привлечению</CardTitle>
              <CardDescription>Самые эффективные реферальные партнёры</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topPartners.map((partner, index) => (
                  <div key={partner.name} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full text-sm font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium">{partner.name}</div>
                        <div className="text-sm text-muted-foreground">{partner.referrals} рефералов</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">${partner.earned}</div>
                      <div className="text-sm text-muted-foreground">заработал</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Статистика реферальной программы</CardTitle>
              <CardDescription>Общие показатели партнёрской программы</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Всего партнёров</span>
                  <span className="text-lg font-bold">156</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Активных партнёров</span>
                  <span className="text-lg font-bold">89</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Приведено пользователей</span>
                  <span className="text-lg font-bold">1,567</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Выплачено партнёрам</span>
                  <span className="text-lg font-bold">$8,450</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Доход с реферального трафика</span>
                    <span className="text-lg font-bold text-green-600">$58,920</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">ROI: {((58920 / 8450) * 100).toFixed(0)}%</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Channel Performance Comparison */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Сравнение эффективности каналов</h3>
        <Card>
          <CardHeader>
            <CardTitle>Визуализация эффективности</CardTitle>
            <CardDescription>Сравнение ключевых метрик по каналам</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium mb-3">Конверсия в платящих пользователей</h4>
                <div className="space-y-2">
                  {trafficSources.map((source) => (
                    <div key={source.source} className="flex items-center space-x-4">
                      <div className="w-24 text-sm">{source.source}</div>
                      <div className="flex-1">
                        <Progress value={source.conversionRate} className="h-2" />
                      </div>
                      <div className="w-12 text-sm text-right">{source.conversionRate}%</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-3">ROMI (Return on Marketing Investment)</h4>
                <div className="space-y-2">
                  {trafficSources
                    .filter((s) => s.romi > 0)
                    .map((source) => (
                      <div key={source.source} className="flex items-center space-x-4">
                        <div className="w-24 text-sm">{source.source}</div>
                        <div className="flex-1">
                          <Progress value={Math.min(source.romi / 10, 100)} className="h-2" />
                        </div>
                        <div className="w-16 text-sm text-right">{source.romi.toFixed(0)}%</div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
