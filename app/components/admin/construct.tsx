import { useState } from "react";
import overridesData from "overrides.json";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

export default function Constructor() {
  const [entries, setEntries] = useState<Record<string, any>>(overridesData);
  const [selectedContainerId, setSelectedContainerId] = useState<string | null>(null);

  const containerEntries = Object.entries(entries).filter(
    ([_, data]) => data.name?.toLowerCase().includes("container")
  );
  const itemEntries = Object.entries(entries).filter(
    ([_, data]) => !data.name?.toLowerCase().includes("container")
  );

  const updateContents = (id: string, newContents: number[]) => {
    setEntries((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        contents: newContents
      }
    }));
  };

  const calculateEV = (contents: number[]) => {
    const items = contents.map((id) => entries[id]).filter(Boolean);
    if (!items.length) return 0;
    const chance = 1 / items.length;
    return items.reduce((acc, item) => acc + parseFloat(item.price || 0) * chance, 0);
  };

  const getSuggestedItems = (currentContents: number[], containerValue: number) => {
    const maxEV = containerValue * 0.93;
    return itemEntries
      .filter(([id, item]) => {
        if (currentContents.includes(Number(id))) return false;
        const testEV = calculateEV([...currentContents, Number(id)]);
        return testEV <= maxEV;
      })
      .map(([id, item]) => ({
        id,
        name: item.name,
        price: parseFloat(item.price || 0)
      }))
      .sort((a, b) => a.price - b.price);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Левая колонка: Таблица предметов */}
    <div className="space-y-8">
      {/* Таблица всех предметов (не контейнеров) */}
      <Card>
        <CardHeader>
          <CardTitle>📦 Предметы (без контейнеров)</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-left border">
            <thead>
              <tr className="border-b">
                <th className="p-2">ID</th>
                <th className="p-2">Название</th>
                <th className="p-2">Цена</th>
              </tr>
            </thead>
            <tbody>
              {itemEntries.map(([id, data]) => (
                <tr key={id} className="border-b">
                  <td className="p-2">{id}</td>
                  <td className="p-2">{data.name}</td>
                  <td className="p-2">{data.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
    {/* Правая колонка: Редактор + Массовое обновление */}
      <div className="space-y-6">
      {/* Контейнеры: выбор и редактирование contents */}
      <Card>
        <CardHeader>
          <CardTitle>🎯 Редактирование контейнеров</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select value={selectedContainerId || ""} onValueChange={(val) => setSelectedContainerId(val)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Выберите контейнер" />
            </SelectTrigger>
            <SelectContent>
              {containerEntries.map(([id, data]) => (
                <SelectItem key={id} value={id}>{id} — {data.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedContainerId && entries[selectedContainerId] && (
            <div className="space-y-4">
              <p><strong>Содержимое:</strong></p>
              <ul className="list-disc pl-5">
                {entries[selectedContainerId].contents?.map((itemId: number, index: number) => (
                  <li key={index}>
                    {itemId} — {entries[itemId]?.name || "Не найден"} ({entries[itemId]?.price || 0} TON)
                    <Button variant="ghost" size="sm" onClick={() => {
                      const updated = entries[selectedContainerId].contents.filter((id: number) => id !== itemId);
                      updateContents(selectedContainerId, updated);
                    }}>➖</Button>
                  </li>
                ))}
              </ul>

              <Input
                placeholder="Добавить ID предмета"
                type="number"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const newId = parseInt((e.target as HTMLInputElement).value);
                    if (!isNaN(newId)) {
                      const current = entries[selectedContainerId].contents || [];
                      if (!current.includes(newId)) {
                        updateContents(selectedContainerId, [...current, newId]);
                      }
                      (e.target as HTMLInputElement).value = "";
                    }
                  }
                }}
              />

              <p><strong>EV:</strong> {calculateEV(entries[selectedContainerId].contents || []).toFixed(2)} TON</p>

              <div className="mt-4">
                <p className="mb-2 font-semibold">📌 Подсказки (для EV ≤ 93%)</p>
                <ul className="list-disc pl-5 space-y-1">
                  {getSuggestedItems(entries[selectedContainerId].contents || [], parseFloat(entries[selectedContainerId]?.price || "2")).map((item) => (
                    <li key={item.id}>
                      {item.id} — {item.name} ({item.price} TON)
                      <Button
                        size="sm"
                        variant="outline"
                        className="ml-2"
                        onClick={() => {
                          const current = entries[selectedContainerId].contents || [];
                          updateContents(selectedContainerId, [...current, Number(item.id)]);
                        }}
                      >➕</Button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  onClick={() => {
                    const json = JSON.stringify(entries, null,2);

                    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
                    const backupBlob = new Blob([json], { type: "application/json" });
                    const backupUrl = URL.createObjectURL(backupBlob);
                    const backupLink = document.createElement("a");
                    backupLink.href = backupUrl;
                    backupLink.download = `overrides_backup_${timestamp}.json`;
                    backupLink.click();
                    URL.revokeObjectURL(backupUrl);

                    const mainBlob = new Blob([json], { type: "application/json" });
                    const mainUrl = URL.createObjectURL(mainBlob);
                    const mainLink = document.createElement("a");
                    mainLink.href = mainUrl;
                    mainLink.download = `overrides.json`;
                    mainLink.click();
                    URL.revokeObjectURL(mainUrl);
                  }}
                >
                  💾 Сохранить в JSON
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Массовый апдейт заглушка */}
      <Card>
        <CardHeader>
          <CardTitle>🔁 Массовое обновление предметов</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Эта секция будет использовать скрипты из проекта (укажешь позже). Пока это просто заглушка для UI.</p>
          <Button disabled variant="outline">Загрузить скрипт обновления</Button>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
