import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";

export default function StatsCard({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>{title}</CardDescription>
        <CardTitle className="text-4xl">{value}</CardTitle>
      </CardHeader>
    </Card>
  );
}
