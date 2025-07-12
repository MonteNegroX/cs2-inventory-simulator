"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Package, TrendingUp, TrendingDown, Target } from "lucide-react"

interface CaseMechanicsProps {
  timeRange: string
}

export default function CaseMechanics({ timeRange }: CaseMechanicsProps) {
  // Mock data
  const caseStats = {
    totalOpened: 15678,
    dailyAverage: 2240,
    averagePerUser: 5.8,
    totalRevenue: 89500,
  }

  const popularCases = [
    { name: "Классический кейс", opened: 4567, revenue: 22835, roi: 125.4, ev: 18.3 },
    { name: "Премиум кейс", opened: 3421, revenue: 34210, roi: 98.7, ev: 34.65 },
    { name: "Мега кейс", opened: 2134, revenue: 21340, roi: 87.2, ev: 67.8 },
    { name: "Стартовый кейс", opened: 5556, revenue: 11112, roi: 156.8, ev: 2.0 },
  ]

  const dropTable = [
    { item: "Обычный предмет", rarity: "Common", plannedChance: 65.0, actualChance: 67.2, deviation: 2.2 },
    { item: "Редкий предмет", rarity: "Rare", plannedChance: 25.0, actualChance: 23.8, deviation: -1.2 },
    { item: "Эпический предмет", rarity: "Epic", plannedChance: 8.0, actualChance: 7.5, deviation: -0.5 },
    { item: "Легендарный предмет", rarity: "Legendary", plannedChance: 2.0, actualChance: 1.5, deviation: -0.5 },
  ]

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "Common":
        return "bg-gray-500"
      case "Rare":
        return "bg-blue-500"
      case "Epic":
        return "bg-purple-500"
      case "Legendary":
        return "bg-orange-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="space-y-6">
      {/* Case Statistics */}
      <div>
        <h3 className="text-lg font-semibold mb-4">📦 Статистика кейсов</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Всего открыто</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{caseStats.totalOpened.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">За выбранный период</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">В день в среднем</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{caseStats.dailyAverage.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Кейсов в день</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">На пользователя</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{caseStats.averagePerUser}</div>
              <div className="text-xs text-muted-foreground">Среднее количество</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Доход с кейсов</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${caseStats.totalRevenue.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Общая выручка</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Popular Cases */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Популярные кейсы и их ROI</h3>
        <Card>
          <CardHeader>
            <CardTitle>Статистика по кейсам</CardTitle>
            <CardDescription>Анализ эффективности различных типов кейсов</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Название кейса</TableHead>
                  <TableHead>Открыто</TableHead>
                  <TableHead>Доход</TableHead>
                  <TableHead>ROI</TableHead>
                  <TableHead>Expected Value</TableHead>
                  <TableHead>Статус</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {popularCases.map((caseItem) => (
                  <TableRow key={caseItem.name}>
                    <TableCell className="font-medium">{caseItem.name}</TableCell>
                    <TableCell>{caseItem.opened.toLocaleString()}</TableCell>
                    <TableCell>${caseItem.revenue.toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {caseItem.roi > 100 ? (
                          <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                        )}
                        {caseItem.roi}%
                      </div>
                    </TableCell>
                    <TableCell>${caseItem.ev}</TableCell>
                    <TableCell>
                      <Badge variant={caseItem.roi > 100 ? "default" : "secondary"}>
                        {caseItem.roi > 100 ? "Прибыльный" : "Убыточный"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Drop Table Analysis */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Дроп-таблица в разрезе реальных результатов</h3>
        <Card>
          <CardHeader>
            <CardTitle>Анализ выпадений</CardTitle>
            <CardDescription>Сравнение запланированных и фактических шансов выпадения предметов</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Предмет</TableHead>
                  <TableHead>Редкость</TableHead>
                  <TableHead>Планируемый %</TableHead>
                  <TableHead>Фактический %</TableHead>
                  <TableHead>Отклонение</TableHead>
                  <TableHead>Статус</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dropTable.map((item) => (
                  <TableRow key={item.item}>
                    <TableCell className="font-medium">{item.item}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-2 ${getRarityColor(item.rarity)}`}></div>
                        {item.rarity}
                      </div>
                    </TableCell>
                    <TableCell>{item.plannedChance}%</TableCell>
                    <TableCell>{item.actualChance}%</TableCell>
                    <TableCell>
                      <div className={`flex items-center ${item.deviation > 0 ? "text-red-500" : "text-green-500"}`}>
                        {item.deviation > 0 ? (
                          <TrendingUp className="h-4 w-4 mr-1" />
                        ) : (
                          <TrendingDown className="h-4 w-4 mr-1" />
                        )}
                        {Math.abs(item.deviation)}%
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={Math.abs(item.deviation) < 1 ? "default" : "destructive"}>
                        {Math.abs(item.deviation) < 1 ? "В норме" : "Отклонение"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Expected Profit Analysis */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Анализ ожидаемой прибыли</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Общий EV</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$142,750</div>
              <div className="text-xs text-muted-foreground">Ожидаемая прибыль</div>
              <Progress value={78} className="mt-2" />
              <div className="text-xs text-muted-foreground mt-1">78% от планируемого</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Фактические выплаты</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$85,250</div>
              <div className="text-xs text-muted-foreground">Выплачено игрокам</div>
              <Progress value={59.7} className="mt-2" />
              <div className="text-xs text-muted-foreground mt-1">59.7% от EV</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Чистая прибыль</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">$57,500</div>
              <div className="text-xs text-muted-foreground">EV - выплаты</div>
              <div className="flex items-center text-xs text-green-600 mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +15.2% к прошлому периоду
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
