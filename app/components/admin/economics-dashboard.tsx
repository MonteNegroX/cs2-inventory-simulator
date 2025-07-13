"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, DollarSign, CreditCard } from "lucide-react"
import { useDateRange } from "~/contexts/DateRangeContext";
import { getDateFromRange } from "~/utils/getDateFromRange";


export default function EconomicsDashboard() {
  // Mock data
  const { range } = useDateRange();
  const fromDate = getDateFromRange(range);

  const revenueData = {
    total: 125430,
    cases: 89500,
    subscriptions: 23400,
    donations: 8900,
    upgrades: 3630,
  }

  const expensesData = {
    marketing: 45000,
    payouts: 32000,
    infrastructure: 8500,
  }

  const currencyData = {
    tokensIssued: 1250000,
    tokensBurned: 180000,
    tokensInCirculation: 1070000,
    projectTurnover: 89500,
    projectProfit: 57500,
  }

  return (
    <div className="space-y-6">
      {/* Revenue Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4">💰 Доходы</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Общий доход</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${revenueData.total.toLocaleString()}</div>
              <div className="flex items-center text-xs text-green-600 mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +12.5%
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Кейсы</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">${revenueData.cases.toLocaleString()}</div>
              <Progress value={71.4} className="mt-2" />
              <div className="text-xs text-muted-foreground mt-1">71.4% от общего</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Подписки</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">${revenueData.subscriptions.toLocaleString()}</div>
              <Progress value={18.7} className="mt-2" />
              <div className="text-xs text-muted-foreground mt-1">18.7% от общего</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Донаты</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">${revenueData.donations.toLocaleString()}</div>
              <Progress value={7.1} className="mt-2" />
              <div className="text-xs text-muted-foreground mt-1">7.1% от общего</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Апгрейды</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">${revenueData.upgrades.toLocaleString()}</div>
              <Progress value={2.9} className="mt-2" />
              <div className="text-xs text-muted-foreground mt-1">2.9% от общего</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Expenses Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4">💸 Расходы</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Маркетинг</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${expensesData.marketing.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">По каналам</div>
              <div className="mt-2 space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Google Ads</span>
                  <span>$18,000</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Facebook</span>
                  <span>$15,000</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Telegram</span>
                  <span>$12,000</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Выплаты игрокам</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${expensesData.payouts.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Выводы и партнёрские</div>
              <div className="flex items-center text-xs text-red-600 mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +8.3%
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Инфраструктура</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${expensesData.infrastructure.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Серверы и сервисы</div>
              <div className="flex items-center text-xs text-green-600 mt-1">
                <TrendingDown className="h-3 w-3 mr-1" />
                -2.1%
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Currency Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4">🧾 Внутренняя валюта</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Выпущено токенов</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">{currencyData.tokensIssued.toLocaleString()}</div>
              <Badge variant="secondary" className="mt-1">
                Всего
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Сожжено токенов</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">{currencyData.tokensBurned.toLocaleString()}</div>
              <Badge variant="destructive" className="mt-1">
                Burn
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">В обороте</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">{currencyData.tokensInCirculation.toLocaleString()}</div>
              <Badge variant="default" className="mt-1">
                Активные
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Оборот проекта</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">${currencyData.projectTurnover.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">TON/USDT</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Профит проекта</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-green-600">${currencyData.projectProfit.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">EV - выплаты</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Profit Margin Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Анализ рентабельности</CardTitle>
          <CardDescription>Соотношение доходов и расходов</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Общий доход</span>
              <span className="text-sm font-bold text-green-600">+${revenueData.total.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Общие расходы</span>
              <span className="text-sm font-bold text-red-600">
                -${(expensesData.marketing + expensesData.payouts + expensesData.infrastructure).toLocaleString()}
              </span>
            </div>
            <div className="border-t pt-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">Чистая прибыль</span>
                <span className="font-bold text-lg text-green-600">
                  $
                  {(
                    revenueData.total -
                    expensesData.marketing -
                    expensesData.payouts -
                    expensesData.infrastructure
                  ).toLocaleString()}
                </span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Маржа:{" "}
                {(
                  ((revenueData.total - expensesData.marketing - expensesData.payouts - expensesData.infrastructure) /
                    revenueData.total) *
                  100
                ).toFixed(1)}
                %
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
