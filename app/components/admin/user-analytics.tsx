"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Users, UserPlus, CreditCard, RotateCcw } from "lucide-react"

interface UserAnalyticsProps {
  timeRange: string
}

export default function UserAnalytics({ timeRange }: UserAnalyticsProps) {
  // Mock data
  const activationData = {
    newUsers: 1247,
    activatedUsers: 892,
    d1Retention: 68.5,
    d7Retention: 42.3,
    d30Retention: 28.7,
  }

  const behaviorData = {
    registered: 1247,
    authorized: 892,
    deposited: 312,
    openedCase: 267,
    withdrew: 89,
  }

  const paymentData = {
    totalDeposits: 1456,
    totalAmount: 45670,
    firstPurchaseConversion: 25.0,
    repeatDeposits: 67.8,
  }

  const funnelSteps = [
    { step: "Зашёл", users: 1247, conversion: 100 },
    { step: "Авторизовался", users: 892, conversion: 71.5 },
    { step: "Пополнил", users: 312, conversion: 25.0 },
    { step: "Открыл кейс", users: 267, conversion: 21.4 },
    { step: "Вывел/реинвестировал", users: 89, conversion: 7.1 },
  ]

  return (
    <div className="space-y-6">
      {/* Activation Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4">📈 Активация</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Новые пользователи</CardTitle>
              <UserPlus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activationData.newUsers.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">За выбранный период</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Активированные</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activationData.activatedUsers.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">
                {((activationData.activatedUsers / activationData.newUsers) * 100).toFixed(1)}% от новых
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">D1 Retention</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activationData.d1Retention}%</div>
              <Progress value={activationData.d1Retention} className="mt-2" />
              <div className="text-xs text-muted-foreground mt-1">Вернулись через день</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">D7 Retention</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activationData.d7Retention}%</div>
              <Progress value={activationData.d7Retention} className="mt-2" />
              <div className="text-xs text-muted-foreground mt-1">Вернулись через неделю</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">D30 Retention</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activationData.d30Retention}%</div>
              <Progress value={activationData.d30Retention} className="mt-2" />
              <div className="text-xs text-muted-foreground mt-1">Вернулись через месяц</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Behavior Funnel */}
      <div>
        <h3 className="text-lg font-semibold mb-4">💼 Воронка поведения</h3>
        <Card>
          <CardHeader>
            <CardTitle>Конверсионная воронка</CardTitle>
            <CardDescription>Путь пользователя от регистрации до активных действий</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {funnelSteps.map((step, index) => (
                <div key={step.step} className="flex items-center space-x-4">
                  <div className="w-32 text-sm font-medium">{step.step}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-muted-foreground">{step.users.toLocaleString()} пользователей</span>
                      <span className="text-sm font-medium">{step.conversion}%</span>
                    </div>
                    <Progress value={step.conversion} className="h-2" />
                  </div>
                  {index < funnelSteps.length - 1 && (
                    <div className="text-xs text-muted-foreground">
                      -
                      {(
                        ((funnelSteps[index].users - funnelSteps[index + 1].users) / funnelSteps[index].users) *
                        100
                      ).toFixed(1)}
                      %
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Analytics */}
      <div>
        <h3 className="text-lg font-semibold mb-4">💳 Платежи</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Количество пополнений</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{paymentData.totalDeposits.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Всего транзакций</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Сумма пополнений</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${paymentData.totalAmount.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">
                Средний чек: ${(paymentData.totalAmount / paymentData.totalDeposits).toFixed(2)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Конверсия в первую покупку</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{paymentData.firstPurchaseConversion}%</div>
              <Progress value={paymentData.firstPurchaseConversion} className="mt-2" />
              <div className="text-xs text-muted-foreground mt-1">От зарегистрированных</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Повторные пополнения</CardTitle>
              <RotateCcw className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{paymentData.repeatDeposits}%</div>
              <div className="text-xs text-muted-foreground">Retention Revenue</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* User Segments */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Сегменты пользователей</h3>
        <Card>
          <CardHeader>
            <CardTitle>Активность по сегментам</CardTitle>
            <CardDescription>Распределение пользователей по уровню активности</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Сегмент</TableHead>
                  <TableHead>Пользователи</TableHead>
                  <TableHead>ARPU</TableHead>
                  <TableHead>Средние кейсы</TableHead>
                  <TableHead>Статус</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">VIP игроки</TableCell>
                  <TableCell>89</TableCell>
                  <TableCell>$245.30</TableCell>
                  <TableCell>15.2</TableCell>
                  <TableCell>
                    <Badge variant="default">Высокая активность</Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Активные</TableCell>
                  <TableCell>267</TableCell>
                  <TableCell>$89.50</TableCell>
                  <TableCell>8.7</TableCell>
                  <TableCell>
                    <Badge variant="secondary">Средняя активность</Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Новички</TableCell>
                  <TableCell>536</TableCell>
                  <TableCell>$23.40</TableCell>
                  <TableCell>2.1</TableCell>
                  <TableCell>
                    <Badge variant="outline">Низкая активность</Badge>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Неактивные</TableCell>
                  <TableCell>355</TableCell>
                  <TableCell>$0.00</TableCell>
                  <TableCell>0.0</TableCell>
                  <TableCell>
                    <Badge variant="destructive">Нет активности</Badge>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
