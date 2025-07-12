"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { TrendingUp, TrendingDown, TestTube, Users } from "lucide-react"

interface ABTestsProps {
  timeRange: string
}

export default function ABTests({ timeRange }: ABTestsProps) {
  // Mock data
  const activeTests = [
    {
      name: "Новый дизайн главной страницы",
      status: "Активный",
      startDate: "2024-01-15",
      participants: 2456,
      conversionA: 3.2,
      conversionB: 4.1,
      significance: 95.2,
      winner: "B",
    },
    {
      name: "Приветственный бонус 50% vs 100%",
      status: "Завершён",
      startDate: "2024-01-10",
      participants: 1890,
      conversionA: 25.4,
      conversionB: 31.2,
      significance: 98.7,
      winner: "B",
    },
    {
      name: "Реферальная программа 10% vs 15%",
      status: "Активный",
      startDate: "2024-01-20",
      participants: 1234,
      conversionA: 12.3,
      conversionB: 14.8,
      significance: 87.4,
      winner: "B",
    },
  ]

  const cohortAnalysis = [
    { period: "До обновления UI", users: 5670, arpu: 45.3, retention: 28.5 },
    { period: "После обновления UI", users: 6890, arpu: 52.1, retention: 34.2 },
    { period: "До новых бонусов", users: 4320, arpu: 38.9, retention: 25.1 },
    { period: "После новых бонусов", users: 5890, arpu: 48.7, retention: 31.8 },
  ]

  return (
    <div className="space-y-6">
      {/* Active Tests Overview */}
      <div>
        <h3 className="text-lg font-semibold mb-4">🧪 Активные A/B тесты</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Активных тестов</CardTitle>
              <TestTube className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <div className="text-xs text-muted-foreground">Сейчас проводится</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Участников</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3,690</div>
              <div className="text-xs text-muted-foreground">В активных тестах</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Завершённых тестов</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <div className="text-xs text-muted-foreground">За последний месяц</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tests Results */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Результаты тестов</h3>
        <Card>
          <CardHeader>
            <CardTitle>Детальная статистика A/B тестов</CardTitle>
            <CardDescription>Сравнение вариантов и статистическая значимость</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Название теста</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead>Участники</TableHead>
                  <TableHead>Конверсия A</TableHead>
                  <TableHead>Конверсия B</TableHead>
                  <TableHead>Значимость</TableHead>
                  <TableHead>Победитель</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeTests.map((test) => (
                  <TableRow key={test.name}>
                    <TableCell className="font-medium">{test.name}</TableCell>
                    <TableCell>
                      <Badge variant={test.status === "Активный" ? "default" : "secondary"}>{test.status}</Badge>
                    </TableCell>
                    <TableCell>{test.participants.toLocaleString()}</TableCell>
                    <TableCell>{test.conversionA}%</TableCell>
                    <TableCell>{test.conversionB}%</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Progress value={test.significance} className="w-16 h-2 mr-2" />
                        {test.significance}%
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={test.winner === "B" ? "default" : "outline"}>
                        Вариант {test.winner}
                        {test.winner === "B" && <TrendingUp className="h-3 w-3 ml-1" />}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Cohort Analysis */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Анализ по когортам</h3>
        <Card>
          <CardHeader>
            <CardTitle>Поведение пользователей до/после изменений</CardTitle>
            <CardDescription>Сравнение ключевых метрик по периодам</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Период</TableHead>
                  <TableHead>Пользователи</TableHead>
                  <TableHead>ARPU</TableHead>
                  <TableHead>Retention D30</TableHead>
                  <TableHead>Изменение</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cohortAnalysis.map((cohort, index) => {
                  const isAfter = cohort.period.includes("После")
                  const prevCohort = index > 0 ? cohortAnalysis[index - 1] : null
                  const arpuChange = prevCohort ? ((cohort.arpu - prevCohort.arpu) / prevCohort.arpu) * 100 : 0
                  const retentionChange = prevCohort ? cohort.retention - prevCohort.retention : 0

                  return (
                    <TableRow key={cohort.period}>
                      <TableCell className="font-medium">{cohort.period}</TableCell>
                      <TableCell>{cohort.users.toLocaleString()}</TableCell>
                      <TableCell>${cohort.arpu}</TableCell>
                      <TableCell>{cohort.retention}%</TableCell>
                      <TableCell>
                        {isAfter && prevCohort && (
                          <div className="space-y-1">
                            <div
                              className={`flex items-center text-xs ${arpuChange > 0 ? "text-green-600" : "text-red-600"}`}
                            >
                              {arpuChange > 0 ? (
                                <TrendingUp className="h-3 w-3 mr-1" />
                              ) : (
                                <TrendingDown className="h-3 w-3 mr-1" />
                              )}
                              ARPU: {arpuChange > 0 ? "+" : ""}
                              {arpuChange.toFixed(1)}%
                            </div>
                            <div
                              className={`flex items-center text-xs ${retentionChange > 0 ? "text-green-600" : "text-red-600"}`}
                            >
                              {retentionChange > 0 ? (
                                <TrendingUp className="h-3 w-3 mr-1" />
                              ) : (
                                <TrendingDown className="h-3 w-3 mr-1" />
                              )}
                              Retention: {retentionChange > 0 ? "+" : ""}
                              {retentionChange.toFixed(1)}%
                            </div>
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

      {/* Test Recommendations */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Рекомендации по тестированию</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Готовые к запуску</CardTitle>
              <CardDescription>Тесты, которые можно начать</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 border rounded-lg">
                  <div className="font-medium text-sm">Новый дизайн кейсов</div>
                  <div className="text-xs text-muted-foreground">Тестирование анимации открытия</div>
                  <Badge variant="outline" className="mt-1">
                    Готов к запуску
                  </Badge>
                </div>
                <div className="p-3 border rounded-lg">
                  <div className="font-medium text-sm">Изменение цен на кейсы</div>
                  <div className="text-xs text-muted-foreground">Тест эластичности спроса</div>
                  <Badge variant="outline" className="mt-1">
                    Готов к запуску
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Требуют внимания</CardTitle>
              <CardDescription>Тесты с низкой значимостью</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 border rounded-lg">
                  <div className="font-medium text-sm">Реферальная программа</div>
                  <div className="text-xs text-muted-foreground">Значимость: 87.4% (нужно 95%)</div>
                  <Badge variant="destructive" className="mt-1">
                    Продлить тест
                  </Badge>
                </div>
                <div className="p-3 border rounded-lg">
                  <div className="font-medium text-sm">Цвета кнопок</div>
                  <div className="text-xs text-muted-foreground">Малая выборка участников</div>
                  <Badge variant="destructive" className="mt-1">
                    Увеличить трафик
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
